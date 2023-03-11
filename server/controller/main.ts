//

import axios from "axios";
import {
  Client as DiscordClient,
  Intents,
  Snowflake,
  TextChannel
} from "discord.js";
import {
  NextFunction,
  Request,
  Response
} from "express";
import fs from "fs";
import {
  encode
} from "js-base64";
import {
  Controller
} from "./controller";
import {
  controller,
  get
} from "./decorator";


@controller("/api")
export class MainController extends Controller {

  private discordClient: DiscordClient | null = null;
  private discordComments: Array<unknown> = [];

  @get("/word-counter/count")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    const path = request.query.path as string;
    fs.readdir(path, (error, names) => {
      if (error) {
        response.json(0).end();
      } else {
        const count = names.filter((name) => name.endsWith(".xdnw")).length;
        response.json(count).end();
      }
    });
  }

  @get("/comment-viewer/twitcasting")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    const encodedSecret = encode(`${request.query.key}:${request.query.secret}`);
    const headers = Object.fromEntries([
      ["Accept", "application/json"],
      ["X-Api-Version", "2.0"],
      ["Authorization", `Basic ${encodedSecret}`]
    ]);
    try {
      const result = await axios.get(`https://apiv2.twitcasting.tv/${request.query.path}`, {headers});
      const data = result.data;
      const remaining = result.headers["x-ratelimit-remaining"];
      const resetDate = new Date(parseInt(result.headers["x-ratelimit-reset"]) * 1000).toString();
      response.json({...data, remaining, resetDate}).end();
    } catch (error) {
      response.status(500).end();
    }
  }

  @get("/comment-viewer/discord/start")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    const key = request.query.key as string;
    const channelId = request.query.channelId as Snowflake;
    const firstMessage = request.query.firstMessage as string | undefined;
    if (this.discordClient !== null) {
      this.discordClient.destroy();
    }
    const client = new DiscordClient({intents: Intents.ALL});
    this.discordClient = client;
    await client.login(key);
    if (firstMessage !== undefined) {
      const channel = await client.channels.fetch(channelId);
      if (channel instanceof TextChannel) {
        await channel.send(firstMessage);
      }
    }
    client.on("message", (message) => {
      if (message.channel.id === channelId) {
        const messageJson = message.toJSON() as any;
        const authorJson = message.author.toJSON();
        const memberJson = message.member?.toJSON();
        this.discordComments.push({...messageJson, author: authorJson, member: memberJson});
      }
    });
    response.json(true).end();
  }

  @get("/comment-viewer/discord")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    const comments = this.discordComments;
    this.discordComments = [];
    response.json(comments).end();
  }

}