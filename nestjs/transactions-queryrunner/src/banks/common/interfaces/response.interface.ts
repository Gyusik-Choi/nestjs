export interface ResponseInterface<T> {
  isError: boolean;
  message: string;
  statusCode: number;
  data: T;
}
