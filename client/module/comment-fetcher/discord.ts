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
    let ignorePrefix = this.config.ignorePrefix;
    let rawComments = await axios.get("/interface/discord").then((response) => response.data) as Array<any>;
    let comments = [];
    for (let rawComment of rawComments) {
      let author = rawComment.member.displayName;
      let text = rawComment.content;
      if (ignorePrefix === undefined || !text.startsWith(ignorePrefix)) {
        let comment = new Comment("discord", author, text);
        comments.push(comment);
      }
    }
    return comments;
  }

}


export type DiscordCommentFetcherConfig = {
  name: "discord",
  key: string,
  channelId: string,
  ignorePrefix?: string
};