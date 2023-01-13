import { Application } from "express";
import * as dotenv from "dotenv";
import * as path from "path";

class Locals {
  public static config() {
    dotenv.config({ path: path.join(__dirname, "../../.env") });

    const port = process.env.PORT || 8000;
    const url = process.env.URL || `http://localhost:${port}`;
    const secret = process.env.SECRET || "secret";
    const dbPath = process.env.DB_PATH || "db.sqlite";
    const maxUploadLimit = process.env.MAX_UPLOAD_LIMIT || "50mb";
    const maxParameterLimit = process.env.MAX_PARAMETER_LIMIT ? parseInt(process.env.MAX_PARAMETER_LIMIT) : 100;
    const logToConsole = process.env.LOG_TO_CONSOLE ? !!process.env.LOG_TO_CONSOLE : true;

    const name = process.env.APP_NAME || "Medium";
    const keywords = process.env.APP_KEYWORDS || "keyword";
    const year = new Date().getFullYear();
    const copyright = `Copyright ${year} ${name} | All Rights Reserved`;
    const company = process.env.COMPANY_NAME || "Nizom Ltd";
    const description = process.env.APP_DESCRIPTION || "Lite version of Medium";

    return {
      port,
      url,
      secret,
      dbPath,
      maxUploadLimit,
      maxParameterLimit,
      logToConsole,
      name,
      keywords,
      year,
      copyright,
      company,
      description,
    };
  }

  public static init(_express: Application): Application {
    _express.locals.app = this.config();
    return _express;
  }
}
export default Locals;
