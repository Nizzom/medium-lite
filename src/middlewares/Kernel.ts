import { Application } from "express";

import CORS from "./CORS";
import Http from "./Http";
import Views from "./Views";
import Statics from "./Statics";
import StatusMonitor from "./StatusMonitor";

class Kernel {
  public static init(_express: Application): Application {
    _express = CORS.mount(_express);

    _express = Http.mount(_express);

    _express = Views.mount(_express);

    _express = Statics.mount(_express);

    _express = StatusMonitor.mount(_express);

    return _express;
  }
}

export default Kernel;
