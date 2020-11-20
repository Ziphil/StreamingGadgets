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
    config: {gadgets: []}
  };

  public async componentDidMount(): Promise<void> {
    let path = queryParser.parse(window.location.search).path;
    let params = {path};
    let config = await axios.get("/interface/config", {params}).then((response) => response.data);
    console.log({config});
    this.setState({config});
  }

  public render(): ReactNode {
    let gadgetNodes = this.state.config.gadgets.map((gadgetConfig, index) => {
      if (gadgetConfig.name === "commentViewer") {
        return <CommentViewer key={index} config={gadgetConfig}/>;
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
  config: Config
};

export type Config = {
  gadgets: Array<GadgetConfig>,
  cssPath?: string
};
export type GadgetConfig = CommentViewerConfig;