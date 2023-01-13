declare namespace Express {
    export interface Request {
        flash(event: string, message: any): any;
        logIn(user: any, callback: any): any;
        user(): any;
        logout(): void;
    }
}

interface Flash {
    flash(type: string, message: any): void;
}

declare module "express-flash";