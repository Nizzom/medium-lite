import { Request } from "express";

export interface IRequest extends Request {
  logIn(user: any, callback: any): any;
  user: any;
  logout(): void;
}
