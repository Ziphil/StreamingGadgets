//

import axios from "axios";
import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
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
    let firstMessage = this.config.firstMessage;
    let params = {key, channelId, firstMessage};
    await axios.get("/interface/discord/start", {params});
  }

  private async fetchComments(): Promise<Array<Comment>> {
    let ignorePrefix = this.config.ignorePrefix;
    let rawComments = await axios.get("/interface/discord").then((response) => response.data) as Array<{content: string, [key: string]: any}>;
    let comments = [];
    for (let rawComment of rawComments) {
      let author = rawComment.member.displayName;
      let text = rawComment.content.split(/(<(?:\:|#|@!).+?>)/).map((string, index) => {
        if (index % 2 === 1) {
          return <Fragment key={index}>{this.parseSpecialTag(string)}</Fragment>;
        } else {
          return string;
        }
      });
      if (ignorePrefix === undefined || !(typeof text[0] === "string" && text[0].startsWith(ignorePrefix))) {
        let comment = new Comment("discord", author, text);
        comments.push(comment);
      }
    }
    return comments;
  }

  private parseSpecialTag(string: string): ReactNode {
    let match = string.match(/^<(\:|#|@!)(.+?)>$/);
    if (match !== null) {
      if (match[1] === ":") {
        let idMatch = match[2].match(/^(.+?):(\d+?)$/);
        if (idMatch !== null) {
          let id = idMatch[2];
          let node = <img className="discord-emoji" src={`https://cdn.discordapp.com/emojis/${id}`}/>;
          return node;
        } else {
          return "";
        }
      } else {
        return "";
      }
    } else {
      throw new Error("cannot happen");
    }
  }

}


export type DiscordCommentFetcherConfig = {
  name: "discord",
  key: string,
  channelId: string,
  firstMessage?: string,
  ignorePrefix?: string,
  interval: number
};