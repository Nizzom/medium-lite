import { Application } from "express";
import express from "express";
import * as path from "path";
import Log from "./Log";

class Statics {
  public static mount(_express: Application): Application {
    Log.info(`Mounting ${Statics.name}`);
    _express.use("/public", express.static(path.join(__dirname, "../../public"), { maxAge: "1d" }));
    return _express;
  }
}
export default Statics;