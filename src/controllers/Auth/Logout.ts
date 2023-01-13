import { Response } from "express";

class Logout {
  public static perform(req, res: Response, next): any {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.session.destroy((err) => {
        if (err) {
          console.log("Error : Failed to destroy the session during logout.", err);
        }

        req.user = undefined;
        return res.redirect("/login");
      });
    });
  }
}

export default Logout;
