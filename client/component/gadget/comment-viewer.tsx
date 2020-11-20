//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  Comment,
  CommentFetcher
} from "../../module/comment-fetcher/comment-fetcher";
import {
  DummyCommentFetcher
} from "../../module/comment-fetcher/dummy";
import {
  YoutubeCommentFetcher
} from "../../module/comment-fetcher/youtube";


export class CommentViewer extends Component<Props, State> {

  public state: State = {
    fetchers: [],
    comments: []
  };

  public constructor(props: Props) {
    super(props);
    let fetchers = [];
    for (let [name, fetcherConfig] of Object.entries<any>(props.config)) {
      if (name === "youtube") {
        fetchers.push(new YoutubeCommentFetcher(fetcherConfig));
      } else if (name === "dummy") {
        fetchers.push(new DummyCommentFetcher(fetcherConfig));
      }
    }
    this.state.fetchers = fetchers;
  }

  public async componentDidMount(): Promise<void> {
    await this.start();
    setInterval(this.update.bind(this), 2000);
  }

  private async start(): Promise<void> {
    let promises = this.state.fetchers.map((fetcher) => fetcher.start());
    await Promise.all(promises);
  }

  private async update(): Promise<void> {
    let promises = this.state.fetchers.map((fetcher) => fetcher.update());
    let addedComments = (await Promise.all(promises)).flat();
    let comments = [...this.state.comments, ...addedComments];
    this.setState({comments});
  }

  public render(): ReactNode {
    let commentNodes = this.state.comments.map((comment, index) => {
      let commentNode = (
        <div className="comment" key={index}>
          <span className="author">{comment.author}</span>
          <span className="text">{comment.text}</span>
        </div>
      );
      return commentNode;
    });
    let node = (
      <div className="comment-viewer">
        {commentNodes}
      </div>
    );
    return node;
  }

}


type Props = {
  config: any
};
type State = {
  fetchers: Array<CommentFetcher>,
  comments: Array<Comment>
};