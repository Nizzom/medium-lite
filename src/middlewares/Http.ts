import bodyParser from "body-parser";
import { Application } from "express";
import flash from "express-flash";
import expressValidator from "express-validator"
import Locals from "../providers/Locals";
import Log from "./Log";
import session from "express-session";
import Passport from "../providers/Passport";

class Http {
  public static mount(_express: Application): Application {
    Log.info(`Mounting ${Http.name}`);

    _express.use(
      bodyParser.json({
        limit: Locals.config().maxUploadLimit,
      })
    );

    _express.use(
      bodyParser.urlencoded({
        limit: Locals.config().maxUploadLimit,
        parameterLimit: Locals.config().maxParameterLimit,
        extended: false,
      })
    );

    _express.disable("x-powered-by");
    _express.use(expressValidator());
    _express.use(flash());
    _express.use(
      session({
        secret: Locals.config().secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 1209600000, // two weeks (in ms)
        },
      })
    );

		_express = Passport.mountPackage(_express);

    return _express;
  }
}
export default Http;
