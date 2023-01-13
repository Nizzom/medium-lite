import User from "../models/User";
import Log from "../middlewares/Log";
import Database from "./Database";
import Express from "./Express";
import Post from "../models/Post";

class App {
  public clearConsole(): void {
    process.stdout.write("\x1B[2J\x1B[0f");
  }

  public loadServer(): void {
    Log.info(`${App.name}:${this.loadServer.name}...`);

    Express.init();
  }

  public loadDatabase(): void {
    Log.info(`${App.name}:${this.loadDatabase.name}...`);

    Database.init();
  }
}
export default new App();
