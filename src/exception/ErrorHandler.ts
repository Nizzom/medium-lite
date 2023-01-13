import { Application, Errback, ErrorRequestHandler, NextFunction, Request, Response } from "express";
import Log from "../middlewares/Log";

class ErrorHandler {
  public static notFoundHandler(_express: Application): Application {
    _express.use("*", (req, res) => {
      const ip = req.headers["x-forwarded-for"] || req.ip;

      Log.error(`Path '${req.originalUrl}' not found [IP: '${ip}']!`);
      res.render("pages/error", {
        title: "Page not found",
        error: [],
      });
    });
    return _express;
  }
  public static logErrors(err: any, req: Request, res: Response, next: NextFunction) {
    Log.error(err.stack);
    return next(err);
  }

  public static clientErrorHandler(err: any, req: Request, res: Response, next: NextFunction): any {
    Log.error(err.stack);

    if (req.xhr) {
      return res.status(500).send({ error: "Something went wrong!" });
    } else {
      return next(err);
    }
  }
  public static errorHandler(err: any, req: Request, res: Response, next: NextFunction): any {
    res.status(500);
    return res.render('pages/error', { error: err.stack, title: 'Under Maintenance' });
  }
}
export default ErrorHandler;