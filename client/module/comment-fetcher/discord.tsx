//

import axios from "axios";
import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import {
  toArray
} from "../../util/array";
import {
  Comment,
  CommentFetcher
} from "./base";


export class DiscordCommentFetcher extends CommentFetcher<DiscordCommentFetcherConfig> {

  public async start(): Promise<void> {
    await this.prepareClient();
  }

  public async update(): Promise<Array<Comment>> {
    const comments = await this.fetchComments();
    return comments;
  }

  private async prepareClient(): Promise<void> {
    const key = this.config.key;
    const channelIds = toArray(this.config.channelId);
    const firstMessage = this.config.firstMessage;
    const body = {key, channelIds, firstMessage};
    await axios.post("/api/comment-viewer/discord/start", body);
  }

  private async fetchComments(): Promise<Array<Comment>> {
    const ignorePrefix = this.config.ignorePrefix;
    const rawComments = await axios.get("/api/comment-viewer/discord").then((response) => response.data) as Array<{content: string, [key: string]: any}>;
    const comments = [];
    for (const rawComment of rawComments) {
      const author = rawComment.member.displayName;
      const text = rawComment.content.split(/(<(?:\:|#|@!).+?>)/).map((string, index) => {
        if (index % 2 === 1) {
          return <Fragment key={index}>{this.parseSpecialTag(string)}</Fragment>;
        } else {
          return string;
        }
      });
      if (ignorePrefix === undefined || !(typeof text[0] === "string" && text[0].startsWith(ignorePrefix))) {
        const comment = {platformName: "discord", author, text};
        comments.push(comment);
      }
    }
    return comments;
  }

  private parseSpecialTag(string: string): ReactNode {
    const match = string.match(/^<(\:|#|@!)(.+?)>$/);
    if (match !== null) {
      if (match[1] === ":") {
        const idMatch = match[2].match(/^(.+?):(\d+?)$/);
        if (idMatch !== null) {
          const id = idMatch[2];
          const node = <img className="discord-emoji" src={`https://cdn.discordapp.com/emojis/${id}`}/>;
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
  channelId: string | Array<string>,
  firstMessage?: string,
  ignorePrefix?: string,
  interval: number
};