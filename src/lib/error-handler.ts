import { ApiError } from "@/types";

export class ApiErrorHandler {
  static handle(error: unknown): ApiError {
    if (error instanceof Error) {
      if (error.message.includes("HTTP error! status:")) {
        const statusMatch = error.message.match(/status: (\d+)/);
        const statusCode = statusMatch ? parseInt(statusMatch[1]) : 500;

        return {
          message: this.getErrorMessage(statusCode),
          statusCode,
        };
      }

      if (error.message.includes("ThrottlerException")) {
        return {
          message: "Too many requests. Please try again later.",
          statusCode: 429,
        };
      }

      return {
        message: error.message,
        statusCode: 500,
      };
    }

    return {
      message: "An unexpected error occurred",
      statusCode: 500,
    };
  }

  private static getErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return "Bad request. Please check your input.";
      case 401:
        return "Invalid credentials. Please try again.";
      case 403:
        return "Access denied. Invalid or expired token.";
      case 404:
        return "Resource not found.";
      case 409:
        return "User with this email or username already exists.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Internal server error. Please try again later.";
      default:
        return "An error occurred. Please try again.";
    }
  }
}
