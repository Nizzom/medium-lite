import { Request, Response, NextFunction } from "express";
import User from "../../models/User";

class Register {
  public static show(req: Request, res: Response): any {
    return res.render("pages/register", {
      title: "Register",
    });
  }

  public static async perform(req: Request, res: Response, next: NextFunction) {
    req.assert("email", "E-mail cannot be blank").notEmpty();
    req.assert("email", "E-mail is not valid").isEmail();
    req.assert("password", "Password cannot be blank").notEmpty();
    req.assert("password", "Password length must be atleast 8 characters").isLength({ min: 8 });
    req.assert("confirmPassword", "Confirmation Password cannot be blank").notEmpty();
    req.assert("confirmPassword", "Password & Confirmation password does not match").equals(req.body.password);
    req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();
    if (errors) {
      req.flash("errors", errors);
      return res.redirect("/register");
    }

    const user = await User.findOneByEmail(req.body.email)
      .then((user) => user)
      .catch((err) => {
        if (err) {
          return next(err);
        }
      });

    if (user) {
      console.log("user", user);
      req.flash("errors", { msg: "Account with the e-mail address already exists." });
      return res.redirect("/Register");
    }

    User.create({
      email: req.body.email,
      password: req.body.password,
    })
      .then((user) => {
        User.findOneByEmail(req.body.email)
          .then((user) => {
            req.logIn(user, (err) => {
              if (err) {
                return next(err);
              }
              req.flash("success", { msg: "You are successfully logged in now!" });
              res.redirect("/");
            });
          })
          .catch((err) => {
            if (err) {
              return next(err);
            }
          });
      })
      .catch((err) => {
        if (err) {
          return next(err);
        }
      });
  }
}

export default Register;
