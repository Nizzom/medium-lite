import { Application } from "express";
import User from "../models/User";

class Routes {
  public static init(_express: Application): Application {
    _express.get("/", (req, res) => {
    //   User.createUserTable();
      User.create({email: "m@m", password: "m"}, (err, row) => {
        if (err) {
          res.send(err);
        } else {
          res.send(row);
        }
      });
    });
    _express.get("/users", (req, res) => {
        User.find(1, (err, row) => {
          if (err) {
            res.send(err);
          } else {
            res.send(row);
          }
        });
      });
    return _express;
  }
}
export default Routes;
