//

import axios from "axios";
import queryParser from "query-string";
import * as react from "react";
import {
  render
} from "react-dom";
import {
  Root,
  RootConfig
} from "./component/root";


export class Main {

  public async main(): Promise<void> {
    const config = await this.fetchConfig();
    this.appendStyleElement(config);
    this.render(config);
  }

  private async fetchConfig(): Promise<RootConfig> {
    const path = queryParser.parse(window.location.search).path;
    const params = {path};
    const config = await axios.get<RootConfig>("/api/config", {params}).then((response) => response.data);
    return config;
  }

  private async render(config: RootConfig): Promise<void> {
    render(<Root config={config}/>, document.getElementById("root"));
  }

  private appendStyleElement(config: RootConfig): void {
    const path = config.cssPath;
    if (path !== undefined) {
      const element = document.createElement("link");
      element.href = "/api/style?path=" + encodeURIComponent(path);
      element.rel = "stylesheet";
      document.head.appendChild(element);
    }
  }

}


const main = new Main();
main.main();