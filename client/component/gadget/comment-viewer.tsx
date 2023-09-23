//


import * as react from "react";
import {
  useEffect,
  useRef,
  useState
} from "react";
import {
  useMount
} from "react-use";
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
import {
  create
} from "../create";
import {
  useGadgetId
} from "../hook/id";


export const CommentViewer = create(
  "CommentViewer",
  function ({
    config
  }: {
    config: CommentViewerConfig
  }) {

    const id = useGadgetId();
    const fetchersRef = useRef<Array<CommentFetcher>>(createFetchers(config.platforms));
    const virtualCommentsRef = useRef<Array<Comment>>([]);
    const [comments, setComments] = useState<Array<Comment>>([]);

    useMount(async () => {
      const fetchers = fetchersRef.current;
      await Promise.all(fetchers.map((fetcher) => fetcher.start()));
      for (const fetcher of fetchers) {
        setInterval(async () => {
          const addedComments = await fetcher.update();
          virtualCommentsRef.current.push(...addedComments);
          if (addedComments.length > 0) {
            setComments([...virtualCommentsRef.current]);
          }
        }, fetcher.interval);
      }
    });

    useEffect(() => {
      const element = document.getElementById(id)!;
      element.scrollTop = element.scrollHeight;
    }, [comments]);

    const node = (
      <div className="gadget comment-viewer">
        <div className="scroll" id={id}>
          {comments.map((comment, index) => (
            <div className={`comment ${comment.platformName}`} key={index}>
              <span className="author">{comment.author}</span>
              <span className="text">{comment.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
    return node;

  }
);


function createFetchers(platforms: Array<PlatformConfigs[keyof PlatformConfigs]>): Array<CommentFetcher> {
  const rawFetchers = platforms.map((platformConfig) => {
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
  const fetchers = rawFetchers.flatMap((fetcher) => fetcher ?? []);
  return fetchers;
}

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