//

import axios from "axios";


export class YoutubeCommentFetcher {

  private config: YoutubeCommentFetcherConfig;
  private chatId?: string;

  public constructor(config: YoutubeCommentFetcherConfig) {
    this.config = config;
  }

  public async start(): Promise<void> {
    let videoId = await this.fetchVideoId();
    let chatId = (videoId !== undefined) ? await this.fetchChatId(videoId) : undefined;
    this.chatId = chatId;
  }

  private async fetchVideoId(): Promise<string | undefined> {
    if (this.config.videoId !== undefined) {
      let videoId = this.config.videoId;
      return videoId;
    } else if (this.config.channelId !== undefined) {
      let key = this.config.key;
      let channelId = this.config.channelId;
      let params = {key, channelId, part: "snippet", type: "video", eventType: "live"};
      let response = await axios.get("https://www.googleapis.com/youtube/v3/search", {params});
      let videoId = (response.data["items"].length > 0) ? response.data["items"][0]["id"]["videoId"] : undefined;
      console.log({videoId});
      return videoId;
    } else {
      return undefined;
    }
  }

  private async fetchChatId(videoId: string): Promise<string | undefined> {
    let key = this.config.key;
    let id = videoId;
    let params = {key, id, part: "liveStreamingDetails"};
    let response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {params});
    let chatId = (response.data["items"].length > 0) ? response.data["items"][0]["liveStreamingDetails"]["activeLiveChatId"] : undefined;
    console.log({chatId});
    return chatId;
  }

}


type YoutubeCommentFetcherConfig = {
  key: string,
  channelId?: string,
  videoId?: string
};