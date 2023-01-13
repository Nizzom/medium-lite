import { Application, NextFunction, Request, Response } from "express";
import passport from "passport";
import LocalStrategy from '../stategies/Local';
import Log from "../middlewares/Log";
import User from "../models/User";

type TUser = {
  _id?: number;
};

class Passport {
  public mountPackage(_express: Application): Application {
    _express = _express.use(passport.initialize());
    _express = _express.use(passport.session());

    passport.serializeUser((user: TUser, done) => {
      done(null, user._id);
    });

    passport.deserializeUser<any, any>((id, done) => {
      User.findOne(id, (err: any, user: any) => {
        done(err, user);
      });
    });

    this.mountLocalStrategies();

    return _express;
  }

  public mountLocalStrategies(): void {
    try {
      LocalStrategy.init(passport);
    } catch (_err: any) {
      Log.error(_err.stack);
    }
  }

  public isAuthenticated(req: Request, res: Response, next: NextFunction): any {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash("errors", { msg: "Please Log-In to access any further!" });
    return res.redirect("/login");
  }
}
export default new Passport;
