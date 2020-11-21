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
      let stream = readline.createInterface({input: fs.createReadStream(path)});
      let count = 0;
      stream.on("line", (line) => {
        if (line.match(/^\*\s*(.+)\s*$/)) {
          count ++;
        }
      });
      stream.on("close", () => {
        response.json(count).end();
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