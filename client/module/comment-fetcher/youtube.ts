//

import axios from "axios";
import {Comment, CommentFetcher} from "./base";


export class YoutubeCommentFetcher extends CommentFetcher<YoutubeCommentFetcherConfig> {

  private liveChatId?: string;
  private pageToken?: string;

  public async start(): Promise<void> {
    const videoId = await this.fetchVideoId();
    const liveChatId = (videoId !== undefined) ? await this.fetchLiveChatId(videoId) : undefined;
    this.liveChatId = liveChatId;
    console.log({videoId, liveChatId});
  }

  public async update(): Promise<Array<Comment>> {
    const comments = await this.fetchComments();
    console.log({comments});
    return comments;
  }

  private async fetchVideoId(): Promise<string | undefined> {
    if (this.config.videoId !== undefined) {
      const videoId = this.config.videoId;
      return videoId;
    } else if (this.config.channelId !== undefined) {
      const key = this.config.key;
      const channelId = this.config.channelId;
      const params = {key, channelId, part: "snippet", type: "video", eventType: "live"};
      try {
        const data = await axios.get("https://www.googleapis.com/youtube/v3/search", {params}).then((response) => response.data);
        if (data["items"].length > 0) {
          return data["items"][0]["id"]["videoId"];
        } else {
          return undefined;
        }
      } catch (error) {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  private async fetchLiveChatId(videoId: string): Promise<string | undefined> {
    const key = this.config.key;
    const id = videoId;
    const params = {key, id, part: "liveStreamingDetails"};
    const data = await axios.get("https://www.googleapis.com/youtube/v3/videos", {params}).then((response) => response.data);
    if (data["items"].length > 0) {
      return data["items"][0]["liveStreamingDetails"]["activeLiveChatId"];
    } else {
      return undefined;
    }
  }

  private async fetchComments(): Promise<Array<Comment>> {
    if (this.liveChatId !== undefined) {
      const key = this.config.key;
      const liveChatId = this.liveChatId;
      const pageToken = this.pageToken;
      const params = {key, liveChatId, pageToken, part: "id,snippet,authorDetails"};
      try {
        const data = await axios.get("https://www.googleapis.com/youtube/v3/liveChat/messages", {params}).then((response) => response.data);
        const items = data["items"] as Array<any>;
        const nextPageToken = data["nextPageToken"];
        const comments = items.map((item) => {
          const author = item["authorDetails"]["displayName"];
          const text = item["snippet"]["displayMessage"];
          return {platformName: "youtube", author, text};
        });
        this.pageToken = nextPageToken;
        return comments;
      } catch (error) {
        return [];
      }
    } else {
      return [];
    }
  }

}


export type YoutubeCommentFetcherConfig = {
  name: "youtube",
  key: string,
  channelId?: string,
  videoId?: string,
  interval: number
};