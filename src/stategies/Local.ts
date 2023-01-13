import { Strategy } from "passport-local";
import Log from "../middlewares/Log";
import User from "../models/User";

class Local {
  public static init(_passport: any): any {
    _passport.use(
      new Strategy({ usernameField: "email" }, (email, password, done: any) => {
        Log.info(`Email is ${email}`);
        Log.info(`Password is ${password}`);

        User.findOneByEmail(email.toLowerCase(), (err: any, user: any) => {
          Log.info(`user is ${user.email}`);

          if (err) {
            Log.info(`error is ${err}`);
            return done(err);
          }

          if (!user) {
            return done(null, false, { msg: `E-mail ${email} not found.` });
          }

          if (user && !user.password) {
            return done(null, false, {
              msg: `E-mail ${email} was not registered with us using any password. Please use the appropriate providers to Log-In again!`,
            });
          }

          Log.info("comparing password now!");

          user.comparePassword(password, (_err: any, _isMatch: any) => {
            if (_err) {
              return done(_err);
            }
            if (_isMatch) {
              return done(null, user);
            }
            return done(null, false, { msg: "Invalid E-mail or password." });
          });
        });
      })
    );
  }
}

export default Local;
