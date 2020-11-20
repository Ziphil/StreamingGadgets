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
  DummyCommentFetcher,
  DummyCommentFetcherConfig
} from "../../module/comment-fetcher/dummy";
import {
  YoutubeCommentFetcher,
  YoutubeCommentFetcherConfig
} from "../../module/comment-fetcher/youtube";


export class CommentViewer extends Component<Props, State> {

  public state: State = {
    fetchers: [],
    comments: []
  };

  public constructor(props: Props) {
    super(props);
    let rawFetchers = props.config.platforms.map((platformConfig) => {
      if (platformConfig.name === "youtube") {
        return new YoutubeCommentFetcher(platformConfig);
      } else if (platformConfig.name === "dummy") {
        return new DummyCommentFetcher(platformConfig);
      } else {
        return undefined;
      }
    });
    let fetchers = rawFetchers.filter((fetcher) => fetcher !== undefined) as Array<CommentFetcher>;
    this.state.fetchers = fetchers;
  }

  public async componentDidMount(): Promise<void> {
    await this.start();
    let duration = this.props.config.duration;
    setInterval(this.update.bind(this), duration);
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
      <div className="gadget comment-viewer">
        {commentNodes}
      </div>
    );
    return node;
  }

}


type Props = {
  config: CommentViewerConfig
};
type State = {
  fetchers: Array<CommentFetcher>,
  comments: Array<Comment>
};

export type CommentViewerConfig = {
  name: "commentViewer",
  platforms: Array<PlatformConfig>,
  duration: number
};
export type PlatformConfig = YoutubeCommentFetcherConfig | DummyCommentFetcherConfig;