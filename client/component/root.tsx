//

import axios from "axios";
import queryParser from "query-string";
import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  CommentViewer
} from "./gadget/comment-viewer";


export class Root extends Component<Props, State> {

  public state: State = {
    config: null
  };

  public async componentDidMount(): Promise<void> {
    let path = queryParser.parse(window.location.search).path;
    let params = {path};
    let config = await axios.get("/interface/config", {params}).then((response) => response.data);
    this.setState({config});
  }

  public render(): ReactNode {
    let gadgetNodes = [];
    if (this.state.config !== null) {
      for (let [name, config] of Object.entries(this.state.config)) {
        if (name === "commentViewer") {
          gadgetNodes.push(<CommentViewer config={config}/>);
        }
      }
    }
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
  config: any | null
};