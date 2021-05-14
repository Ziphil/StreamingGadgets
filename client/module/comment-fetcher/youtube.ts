//

import axios from "axios";
import {
  Comment,
  CommentFetcher
} from "./base";


export class YoutubeCommentFetcher extends CommentFetcher<YoutubeCommentFetcherConfig> {

  private liveChatId?: string;
  private pageToken?: string;

  public async start(): Promise<void> {
    let videoId = await this.fetchVideoId();
    let liveChatId = (videoId !== undefined) ? await this.fetchLiveChatId(videoId) : undefined;
    this.liveChatId = liveChatId;
    console.log({videoId, liveChatId});
  }

  public async update(): Promise<Array<Comment>> {
    let comments = await this.fetchComments();
    console.log({comments});
    return comments;
  }

  private async fetchVideoId(): Promise<string | undefined> {
    if (this.config.videoId !== undefined) {
      let videoId = this.config.videoId;
      return videoId;
    } else if (this.config.channelId !== undefined) {
      let key = this.config.key;
      let channelId = this.config.channelId;
      let params = {key, channelId, part: "snippet", type: "video", eventType: "live"};
      try {
        let data = await axios.get("https://www.googleapis.com/youtube/v3/search", {params}).then((response) => response.data);
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
    let key = this.config.key;
    let id = videoId;
    let params = {key, id, part: "liveStreamingDetails"};
    let data = await axios.get("https://www.googleapis.com/youtube/v3/videos", {params}).then((response) => response.data);
    if (data["items"].length > 0) {
      return data["items"][0]["liveStreamingDetails"]["activeLiveChatId"];
    } else {
      return undefined;
    }
  }

  private async fetchComments(): Promise<Array<Comment>> {
    if (this.liveChatId !== undefined) {
      let key = this.config.key;
      let liveChatId = this.liveChatId;
      let pageToken = this.pageToken;
      let params = {key, liveChatId, pageToken, part: "id,snippet,authorDetails"};
      try {
        let data = await axios.get("https://www.googleapis.com/youtube/v3/liveChat/messages", {params}).then((response) => response.data);
        let items = data["items"] as Array<any>;
        let nextPageToken = data["nextPageToken"];
        let comments = items.map((item) => {
          let author = item["authorDetails"]["displayName"];
          let text = item["snippet"]["displayMessage"];
          return new Comment("youtube", author, text);
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
  videoId?: string
};