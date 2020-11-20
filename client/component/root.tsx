//

import axios from "axios";
import queryParser from "query-string";
import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  CommentViewer,
  CommentViewerConfig
} from "./gadget/comment-viewer";


export class Root extends Component<Props, State> {

  public state: State = {
    configs: []
  };

  public async componentDidMount(): Promise<void> {
    let path = queryParser.parse(window.location.search).path;
    let params = {path};
    let configs = await axios.get("/interface/config", {params}).then((response) => response.data);
    console.log({configs});
    this.setState({configs});
  }

  public render(): ReactNode {
    let gadgetNodes = this.state.configs.map((config, index) => {
      if (config.name === "commentViewer") {
        return <CommentViewer key={index} config={config}/>;
      } else {
        return undefined;
      }
    });
    let node = (
      <div className="root">
        {gadgetNodes}
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
  configs: Array<Config>
};

export type Config = CommentViewerConfig;