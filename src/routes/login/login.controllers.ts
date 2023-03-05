import { Request, Response } from "express"
import { isString } from "lodash"
import { v4 } from "uuid"
import prisma from "../../utils/db/prisma"
import { handleAnyError } from "../../utils/error/handleAnyError"
import jwt from "jsonwebtoken"
import logger from "../../utils/logging/logger"

export const logIn = async (req: Request, res: Response): Promise<void> => {
  const randomState = v4()
  const clientId = process.env.AUTH0_CLIENT_ID
  const auth0RedirectUri = process.env.AUTH0_REDIRECT_URI
  const auth0EndpointBase = process.env.AUTH0_ENDPOINT_BASE
  if (!isString(auth0EndpointBase)) {
    res.status(500)
    res.json({
      message:
        "No oauth endpoint base. Did you set the AUTH0_ENDPOINT_BASE environment variable?",
    })
    return
  }
  const auth0AuthorisationUrl = `${auth0EndpointBase}/authorize`
  if (!isString(clientId)) {
    res.status(500)
    res.json({
      message:
        "No client id. Did you set the AUTH0_CLIENT_ID environment variable?",
    })
    return
  }

  if (!isString(auth0RedirectUri)) {
    res.status(500)
    res.json({
      message:
        "No redirect uri. Did you set the AUTH0_REDIRECT_URI environment variable?",
    })
    return
  }

  if (!isString(auth0AuthorisationUrl)) {
    res.status(500)
    res.json({
      message:
        "No authorisation url. Did you set the AUTH0_AUTHORISATION_URL environment variable?",
    })
    return
  }
  const authorisationUrl = `${auth0AuthorisationUrl}?response_type=code&client_id=${clientId}&redirect_uri=${auth0RedirectUri}&scope=openid%20profile%20email&state=${randomState}`
  return res.redirect(authorisationUrl)
}

/**
 * @param req Request object from Express framework (https://expressjs.com/en/api.html#req)
 * @param res Response object from Express framework (https://expressjs.com/en/api.html#res)
 * @returns void
 */
export const logInCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authorizationCode = req.query.code
  const clientSecret = process.env.AUTH0_CLIENT_SECRET
  const clientId = process.env.AUTH0_CLIENT_ID
  const auth0RedirectUri = process.env.AUTH0_REDIRECT_URI
  const oauthEndpointBase = process.env.AUTH0_ENDPOINT_BASE
  if (!isString(oauthEndpointBase)) {
    res.status(500)
    res.json({
      message:
        "No oauth endpoint base. Did you set the AUTH0_ENDPOINT_BASE environment variable?",
    })
    return
  }
  const auth0TokenUri = `${oauthEndpointBase}/oauth/token`

  if (!isString(clientSecret)) {
    res.status(500)
    res.json({
      message:
        "No client secret. Did you set the AUTH0_CLIENT_SECRET environment variable?",
    })
    return
  }

  if (!isString(clientId)) {
    res.status(500)
    res.json({
      message:
        "No client id. Did you set the AUTH0_CLIENT_ID environment variable?",
    })
    return
  }

  if (!isString(auth0RedirectUri)) {
    res.status(500)
    res.json({
      message:
        "No redirect uri. Did you set the AUTH0_REDIRECT_URI environment variable?",
    })
    return
  }

  if (!isString(authorizationCode)) {
    res.status(400)
    res.json({
      message:
        "No authorization code. Did you set the AUTH0_REDIRECT_URI environment variable?",
    })
    return
  }

  const options = {
    method: "POST",
    url: auth0TokenUri,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code: authorizationCode,
      redirect_uri: auth0RedirectUri,
    }),
  }

  try {
    const response = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
      body: options.data,
    })
    const data = await response.json()
    const accessToken = data.access_token
    const expiresIn = data.expires_in
    if (!isString(accessToken)) {
      res.status(500)
      res.json({
        message: "No access token in response",
      })
      return
    }
    const auth0UserInfoUri = `${oauthEndpointBase}/userinfo`

    // get user info
    const userInfoResponse = await fetch(auth0UserInfoUri, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
    })
    const userInfo = await userInfoResponse.json()
    logger.info({ userInfo }, "User info")

    if (!isFinite(expiresIn)) {
      res.status(500)
      res.json({
        message: "No expires in in response",
      })
      return
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!isString(jwtSecret)) {
      res.status(500)
      res.json({
        message:
          "No jwt secret. Did you set the JWT_SECRET environment variable?",
      })
      return
    }
    // create a custom access token
    const customAccessToken = jwt.sign(
      {
        sub: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
      },
      jwtSecret,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m",
      }
    )

    // create a custom refresh token
    const refreshToken = jwt.sign(
      {
        sub: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
      },
      jwtSecret,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d",
      }
    )

    // create user in database if it doesn't exist
    const user = await prisma.user.findUnique({
      where: {
        id: userInfo.sub,
      },
    })

    if (user === null) {
      try {
        await prisma.user.create({
          data: {
            id: userInfo.sub,
            name: userInfo.name,
            email: userInfo.email,
          },
        })
      } catch (error: any) {
        handleAnyError(
          error,
          res,
          "Have you already signed up with this email using a different method?"
        )
        return
      }
    }

    res.json({ userInfo, accessToken: customAccessToken, refreshToken })
  } catch (error: any) {
    handleAnyError(error, res)
  }
}

/**
 * Refreshes the access token
 * @param req  Request object from Express framework (https://expressjs.com/en/api.html#req)
 * @param res  Response object from Express framework (https://expressjs.com/en/api.html#res)
 * @returns the response object
 */
export const refreshTokenController = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
  const refreshToken = req.body.refreshToken
  if (!isString(refreshToken)) {
    res.status(400)
    res.json({
      message: "No refresh token",
    })
    return
  }
  const jwtSecret = process.env.JWT_SECRET
  if (!isString(jwtSecret)) {
    res.status(500)
    res.json({
      message:
        "No jwt secret. Did you set the JWT_SECRET environment variable?",
    })
    return
  }

  try {
    const decoded = jwt.verify(refreshToken, jwtSecret)
    const accessToken = jwt.sign(
      {
        sub: decoded.sub,
        name: decoded.name,
        email: decoded.email,
      },
      jwtSecret,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m",
      }
    )

    // rotate refresh token
    const newRefreshToken = jwt.sign(
      {
        sub: decoded.sub,
        name: decoded.name,
        email: decoded.email,
      },
      jwtSecret,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d",
      }
    )

    return res.json({ accessToken, refreshToken: newRefreshToken })
  } catch (error: any) {
    handleAnyError(error)
  }
}
