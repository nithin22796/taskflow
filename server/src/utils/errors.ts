import {ZodError} from "zod";
class ValidationError extends Error {
  issues: ZodError['issues']

  constructor(issues: ZodError['issues']) {
    super("Validation Error");
    this.issues = issues;
  }
}

export default ValidationError;
