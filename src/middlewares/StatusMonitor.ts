import { Application } from "express";
import Locals from "../providers/Locals";
import Log from "./Log";
import expressStatusMonitor from "express-status-monitor"

class StatusMonitor {
  public static mount(_express: Application): Application {
    Log.info(`Mounting ${StatusMonitor.name}`);
    const monitorOptions: object = {
      title: Locals.config().name,
      path: "/status-monitor",
      spans: [
        {
          interval: 1,
          retention: 60,
        },
        {
          interval: 5,
          retention: 60,
        },
        {
          interval: 15,
          retention: 60,
        },
      ],
      chartVisibility: {
        mem: true,
        rps: true,
        cpu: true,
        load: true,
        statusCodes: true,
        responseTime: true,
      },
      healthChecks: [
        {
          protocol: "http",
          host: "localhost",
          path: "/",
          port: Locals.config().port.toString(),
        },
      ],
    };

    _express.use(expressStatusMonitor(monitorOptions));

    return _express;
  }
}
export default StatusMonitor;