//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  YoutubeCommentFetcher
} from "../../module/comment-fetcher/youtube";


export class CommentViewer extends Component<Props, State> {

  public async componentDidMount(): Promise<void> {
    let config = require("../../config.json").commentViewer;
    let fetcher = new YoutubeCommentFetcher(config);
    await fetcher.start();
  }

  public render(): ReactNode {
    let node = (
      <div className="root">
        Hello, React!
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
};