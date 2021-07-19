//

import axios from "axios";
import {
  Comment,
  CommentFetcher
} from "./base";


export class DiscordCommentFetcher extends CommentFetcher<DiscordCommentFetcherConfig> {

  public async start(): Promise<void> {
    await this.prepareClient();
  }

  public async update(): Promise<Array<Comment>> {
    let comments = await this.fetchComments();
    console.log({comments});
    return comments;
  }

  private async prepareClient(): Promise<void> {
    let key = this.config.key;
    let channelId = this.config.channelId;
    let params = {key, channelId};
    await axios.get("/interface/discord/start", {params});
  }

  private async fetchComments(): Promise<Array<Comment>> {
    let rawComments = await axios.get("/interface/discord").then((response) => response.data) as Array<any>;
    let comments = rawComments.map((rawComment) => {
      let author = rawComment.author.username;
      let text = rawComment.content;
      return new Comment("discord", author, text);
    });
    return comments;
  }

}


export type DiscordCommentFetcherConfig = {
  name: "discord",
  key: string,
  channelId: string
};