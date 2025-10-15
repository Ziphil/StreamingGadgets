//

import {NextFunction, Request, Response} from "express";
import fs from "fs";
import yamlParser from "js-yaml";
import pathUtil from "path";
import {Controller} from "./controller";
import {controller, get} from "./decorator";


@controller("/api")
export class SystemController extends Controller {

  @get("/config")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    const path = request.query.path as string;
    fs.readFile(path, {encoding: "utf-8"}, (error, config) => {
      if (error) {
        next(error);
      } else {
        const extension = pathUtil.extname(path);
        if (extension === ".json") {
          response.type("application/json").send(config).end();
        } else if (extension === ".yml" || extension === ".yaml") {
          const json = JSON.stringify(yamlParser.load(config));
          response.type("application/yaml").send(json).end();
        }
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