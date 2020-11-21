//

import axios from "axios";
import queryParser from "query-string";
import * as react from "react";
import {
  Component,
  Fragment,
  ReactNode
} from "react";
import {
  CommentViewer,
  CommentViewerConfig
} from "./gadget/comment-viewer";
import {
  WordCounter,
  WordCounterConfig
} from "./gadget/word-counter";


export class Root extends Component<Props, State> {

  public state: State = {
    config: {gadgets: []}
  };

  public async componentDidMount(): Promise<void> {
    let path = queryParser.parse(window.location.search).path;
    let params = {path};
    try {
      let config = await axios.get<RootConfig>("/interface/config", {params}).then((response) => response.data);
      console.log({config});
      this.appendStyleElement(config.cssPath);
      this.setState({config});
    } catch (error) {
    }
  }

  private appendStyleElement(path: string | undefined): void {
    if (path !== undefined) {
      let element = document.createElement("link");
      element.href = "/interface/style?path=" + encodeURIComponent(path);
      element.rel = "stylesheet";
      document.head.appendChild(element);
    }
  }

  public render(): ReactNode {
    let gadgetNodes = this.state.config.gadgets.map((gadgetConfig, index) => {
      if (gadgetConfig.name === "commentViewer") {
        return <CommentViewer key={index} config={gadgetConfig}/>;
      } else if (gadgetConfig.name === "wordCounter") {
        return <WordCounter key={index} config={gadgetConfig}/>;
      } else {
        return undefined;
      }
    });
    let node = (
      <Fragment>
        {gadgetNodes}
      </Fragment>
    );
    return node;
  }

}


type Props = {
};
type State = {
  config: RootConfig
};

export type RootConfig = {
  gadgets: Array<GadgetConfig>,
  cssPath?: string
};
export type GadgetConfig = CommentViewerConfig | WordCounterConfig;