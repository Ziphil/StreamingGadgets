//

import parser from "body-parser";
import express from "express";
import {
  Express
} from "express";
import {
  MainController
} from "./controller/main";
import {
  SystemController
} from "./controller/system";


export class Main {

  private application!: Express;

  public main(): void {
    this.application = express();
    this.setupBodyParsers();
    this.setupControllers();
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

  private setupControllers(): void {
    MainController.use(this.application);
    SystemController.use(this.application);
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