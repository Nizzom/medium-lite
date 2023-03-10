import { Application } from "express";
import path from "path";
import Log from "./Log";

class Views {
  public static mount(_express: Application): Application {
    Log.info(`Mounting ${Views.name}`);

    _express.set("view engine", "pug");
    _express.set("view options", { pretty: true });
    _express.set("views", path.join(__dirname, "../../views"));
    _express.locals.pretty = true;

    return _express;
  }
}
export default Views;