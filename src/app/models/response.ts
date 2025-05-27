export interface Response<T> {
    data: T;
    status: ResponseStatus;
    message: string;
    internalMessage?: string;
}

export enum ResponseStatus {
    Success = 200,
    NotFound = 404,
    BadRequest = 400,
    Unauthorized = 401,
}
