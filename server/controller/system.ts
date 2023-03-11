//

import {
  NextFunction,
  Request,
  Response
} from "express";
import fs from "fs";
import {
  Controller
} from "./controller";
import {
  controller,
  get
} from "./decorator";


@controller("/api")
export class SystemController extends Controller {

  @get("/config")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    const path = request.query.path as string;
    fs.readFile(path, {encoding: "utf-8"}, (error, config) => {
      if (error) {
        next(error);
      } else {
        response.type("application/json").send(config).end();
      }
    });
  }

  @get("/style")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    const path = request.query.path as string;
    fs.readFile(path, {encoding: "utf-8"}, (error, config) => {
      if (error) {
        response.type("text/css").send("").end();
      } else {
        response.type("text/css").send(config).end();
      }
    });
  }

  @get("/local")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    const path = request.query.path as string;
    response.sendFile(path);
  }

}