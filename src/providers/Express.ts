import express from "express";
import Kernel from "../middlewares/Kernel";
import ErrorHandler from "../exception/ErrorHandler";
import Log from "../middlewares/Log";
import Locals from "./Locals";
import Routes from "./Routes";
class Express {
  public express: express.Application;
  constructor() {
    this.express = express();

    this.mountLocals();
    this.mountMiddlewares();
    this.mountRoutes();
  }
  private mountLocals() {
    this.express = Locals.init(this.express);
  }
  private mountMiddlewares() {
		this.express = Kernel.init(this.express);
  }
  private mountRoutes() {
    this.express = Routes.init(this.express)
  }

  public init() {
    const port = Locals.config().port;
    this.express.use(ErrorHandler.logErrors);
		this.express.use(ErrorHandler.clientErrorHandler);
		this.express.use(ErrorHandler.errorHandler);
		this.express = ErrorHandler.notFoundHandler(this.express);

    this.express
      .listen(port, () => {
        Log.info("Server running on port: " + port);
      })
      .on("error", (_error) => {
        Log.error("Server error " + _error.message);
      });
  }
}
export default new Express();