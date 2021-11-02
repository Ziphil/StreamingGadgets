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
  DiscordCommentFetcher,
  DiscordCommentFetcherConfig
} from "../../module/comment-fetcher/discord";
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

  private virtualComments: Array<Comment> = [];

  public constructor(props: Props) {
    super(props);
    let rawFetchers = props.config.platforms.map((platformConfig) => {
      if (platformConfig.name === "youtube") {
        return new YoutubeCommentFetcher(platformConfig);
      } else if (platformConfig.name === "twitcasting") {
        return new TwitcastingCommentFetcher(platformConfig);
      } else if (platformConfig.name === "discord") {
        return new DiscordCommentFetcher(platformConfig);
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
    for (let fetcher of this.state.fetchers) {
      setInterval(() => this.update(fetcher), fetcher.interval);
    }
  }

  private async start(): Promise<void> {
    let promises = this.state.fetchers.map((fetcher) => fetcher.start());
    await Promise.all(promises);
  }

  private async update(fetcher: CommentFetcher): Promise<void> {
    let addedComments = await fetcher.update();
    this.virtualComments.push(...addedComments);
    let comments = this.virtualComments;
    this.setState({comments}, () => {
      let element = document.getElementById(this.state.id)!;
      element.scrollTop = element.scrollHeight;
    });
  }

  public render(): ReactNode {
    let commentNodes = this.state.comments.map((comment, index) => {
      let commentNode = (
        <div className={`comment ${comment.platformName}`} key={index}>
          <span className="author">{comment.author}</span>
          <span className="text">{comment.text}</span>
        </div>
      );
      return commentNode;
    });
    let node = (
      <div className="gadget comment-viewer">
        <div className="scroll" id={this.state.id}>
          {commentNodes}
        </div>
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
  platforms: Array<PlatformConfigs[keyof PlatformConfigs]>,
  interval: number
};
export type PlatformConfigs = {
  youtube: YoutubeCommentFetcherConfig,
  twitcasting: TwitcastingCommentFetcherConfig,
  discord: DiscordCommentFetcherConfig,
  dummy: DummyCommentFetcherConfig
};