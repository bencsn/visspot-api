import _ from "lodash";
import { z } from "zod";

export function getErrorStatusCode(error: any): number {
  const isResponseStatusFiniteOrString = _.isFinite(error?.response?.status) || _.isString(error?.response?.status);
  let statusFromError: number | string = isResponseStatusFiniteOrString
    ? error?.response?.status
    : error?.status;

  // if the status is a string, convert it to a number
  if (_.isString(statusFromError)) {
    statusFromError = parseInt(statusFromError);
  }

  if (_.isFinite(statusFromError)) {
    return statusFromError;
  }

  return error instanceof z.ZodError ? 400 : 500;
}
