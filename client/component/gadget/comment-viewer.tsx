//

import {
  nanoid
} from "nanoid";
import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  Comment,
  CommentFetcher
} from "../../module/comment-fetcher/base";
import {
  DummyCommentFetcher,
  DummyCommentFetcherConfig
} from "../../module/comment-fetcher/dummy";
import {
  TwitcastingCommentFetcher,
  TwitcastingCommentFetcherConfig
} from "../../module/comment-fetcher/twitcasting";
import {
  YoutubeCommentFetcher,
  YoutubeCommentFetcherConfig
} from "../../module/comment-fetcher/youtube";


export class CommentViewer extends Component<Props, State> {

  public state: State = {
    fetchers: [],
    comments: [],
    id: ""
  };

  public constructor(props: Props) {
    super(props);
    let rawFetchers = props.config.platforms.map((platformConfig) => {
      if (platformConfig.name === "youtube") {
        return new YoutubeCommentFetcher(platformConfig);
      } else if (platformConfig.name === "twitcasting") {
        return new TwitcastingCommentFetcher(platformConfig);
      } else if (platformConfig.name === "dummy") {
        return new DummyCommentFetcher(platformConfig);
      } else {
        return undefined;
      }
    });
    this.state.fetchers = rawFetchers.flatMap((fetcher) => fetcher ?? []);
    this.state.id = nanoid(10);
  }

  public async componentDidMount(): Promise<void> {
    await this.start();
    let interval = this.props.config.interval;
    setInterval(this.update.bind(this), interval);
  }

  private async start(): Promise<void> {
    let promises = this.state.fetchers.map((fetcher) => fetcher.start());
    await Promise.all(promises);
  }

  private async update(): Promise<void> {
    let promises = this.state.fetchers.map((fetcher) => fetcher.update());
    let addedComments = (await Promise.all(promises)).flat();
    let comments = [...this.state.comments, ...addedComments];
    this.setState({comments}, () => {
      let element = document.getElementById(this.state.id)!;
      element.scrollTop = element.scrollHeight;
    });
  }

  public render(): ReactNode {
    let commentNodes = this.state.comments.map((comment, index) => {
      let commentNode = (
        <div className={`comment ${comment.platform}`} key={index}>
          <span className="author">{comment.author}</span>
          <span className="text">{comment.text}</span>
        </div>
      );
      return commentNode;
    });
    let node = (
      <div className="gadget comment-viewer" id={this.state.id}>
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
  comments: Array<Comment>,
  id: string
};

export type CommentViewerConfig = {
  name: "commentViewer",
  platforms: Array<PlatformConfig>,
  interval: number
};
export type PlatformConfig = YoutubeCommentFetcherConfig | TwitcastingCommentFetcherConfig | DummyCommentFetcherConfig;