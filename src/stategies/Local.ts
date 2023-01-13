import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import Log from "../middlewares/Log";
import User from "../models/User";

class Local {
  public static init(_passport: any): any {
    _passport.use(
      new Strategy({ usernameField: "email" }, async (email, password, done: any) => {
        Log.info(`Email is ${email}`);
        Log.info(`Password is ${password}`);

        const user: any = await User.findOneByEmail(email.toLowerCase())
          .then((user) => user)
          .catch((err) => {
            Log.info(`error is ${err}`);
            return done(err);
          });

        if (!user) {
          return done(null, false, { msg: `E-mail ${email} not found.` });
        }

        if (user && !user.password) {
          return done(null, false, {
            msg: `E-mail ${email} was not registered with us using any password. Please use the appropriate providers to Log-In again!`,
          });
        }

        Log.info("comparing password now!");

        bcrypt.compare(password, user.password, (_err, _isMatch) => {
          if (_err) {
            return done(_err);
          }
          if (_isMatch) {
            return done(null, user);
          }
          return done(null, false, { msg: "Invalid E-mail or password." });
        });
      })
    );
  }
}

export default Local;
