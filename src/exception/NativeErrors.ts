import Log from "../middlewares/Log";

class NativeErrors {
  public process(): void {
    process.on("uncaughtException", (exception: any) => {
      Log.error(exception.stack);
    });
    process.on("warning", (warning: any) => {
      Log.error(warning.stack);
    });
  }
}

export default new NativeErrors;
