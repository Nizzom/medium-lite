import { Application } from "express";
import Locals from "../providers/Locals";
import cors from 'cors';
import Log from "./Log";

class CORS {
  public static mount(_express: Application): Application {
    Log.info(`Mounting ${CORS.name}`);

    const options = {
      origin: Locals.config().url,
      optionsSuccessStatus: 200,
    };

    _express.use(cors(options));

    return _express;
  }
}
export default CORS;