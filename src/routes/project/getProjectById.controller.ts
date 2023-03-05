import { Response } from "express"
import prisma from "../../utils/db/prisma"
import { handleAnyError } from "../../utils/error/handleAnyError"
import logger from "../../utils/logging/logger"
import { IExtendedRequest } from "../../utils/types"

export const getProjectById = async (
    req: IExtendedRequest,
    res: Response
): Promise<void> => {
    const userId = req.userId
    const projectId = req.params.id

    try {
        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
            include: {
                users: true,
            },
        })

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!project) {
            res.status(404).json({ message: "Project not found" })
            return
        }

        const userIsInProject = project.users.some((user) => user.id === userId)

        if (!userIsInProject) {
            res.status(403).json({ message: "Access denied" })
            return
        }

        res.status(200).json({ project })
    } catch (error) {
        logger.error(error)
        handleAnyError(error, res)
    }
}