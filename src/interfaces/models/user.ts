export interface IUser {
  email: string;
  rating?: number;
  password: string;
  posts?: Array<number>;
}
