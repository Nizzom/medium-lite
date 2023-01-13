import sqlite3 from "sqlite3";
import User from "../models/User";
import Log from "../middlewares/Log";
import Locals from "./Locals";
import Post from "../models/Post";
class DataBase {
  private sqlite: sqlite3.sqlite3;
  public isReady: boolean = false;
  public db: sqlite3.Database;
  constructor() {
    this.sqlite = sqlite3.verbose();
    const path = Locals.config().dbPath;
    this.db = new this.sqlite.Database(path, (err) => {
      if (err) {
        Log.error(`${DataBase.name} can't connect to DB`);
        Log.error(err.message);
        throw err;
      } else {
        Log.info(`${DataBase.name} connected to DB`);
        this.isReady = true;
      }
    });
  }
  public init() {
  }
}
export default new DataBase();
