class ApiResponse {
    success: boolean;
    message: string;
    data?: any;
    err?: any;

    constructor(success: boolean, message: string, data?: any, err?: any) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.err = err;
    }
}

export default ApiResponse;