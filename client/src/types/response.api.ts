export interface Response<T> {
    timestamp: string;
    message: string;
    data: T;
}