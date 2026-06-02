class ApiError extends Error {
    constructor(statusCode, message = string, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
    }
}

export default ApiError;