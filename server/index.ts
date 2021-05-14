//

import parser from "body-parser";
import express from "express";
import {
  Express
} from "express";
import fs from "fs";
import readline from "readline";


export class Main {

  private application!: Express;

  public main(): void {
    this.application = express();
    this.setupBodyParsers();
    this.setupInterfaces();
    this.setupStatic();
    this.listen();
  }

  // リクエストボディをパースするミドルウェアの設定をします。
  private setupBodyParsers(): void {
    let urlencodedParser = parser.urlencoded({extended: false});
    let jsonParser = parser.json();
    this.application.use(urlencodedParser);
    this.application.use(jsonParser);
  }

  private setupInterfaces(): void {
    this.application.get("/interface/config", (request, response, next) => {
      let path = request.query.path as string;
      fs.readFile(path, {encoding: "utf-8"}, (error, config) => {
        if (error) {
          next(error);
        } else {
          response.type("application/json").send(config).end();
        }
      });
    });
    this.application.get("/interface/style", (request, response, next) => {
      let path = request.query.path as string;
      fs.readFile(path, {encoding: "utf-8"}, (error, config) => {
        if (error) {
          response.type("text/css").send("").end();
        } else {
          response.type("text/css").send(config).end();
        }
      });
    });
    this.application.get("/interface/word-count", (request, response, next) => {
      let path = request.query.path as string;
      fs.readdir(path, (error, names) => {
        if (error) {
          response.json(0).end();
        } else {
          let count = names.filter((name) => name.endsWith(".xdnw")).length;
          response.json(count).end();
        }
      });
    });
  }

  private setupStatic(): void {
    this.application.use("/", express.static(process.cwd() + "/dist/client"));
  }

  private listen(): void {
    this.application.listen(8051, () => {
      console.log("listening");
    });
  }

}


let main = new Main();
main.main();