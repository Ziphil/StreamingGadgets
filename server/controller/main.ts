/* eslint-disable @typescript-eslint/naming-convention */

import axios from "axios";
import {Client as DiscordClient, GatewayIntentBits, Snowflake, TextChannel, VoiceChannel} from "discord.js";
import {NextFunction, Request, Response} from "express";
import fs from "fs";
import {encode} from "js-base64";
import {Controller} from "./controller";
import {controller, get, post} from "./decorator";


@controller("/api")
export class MainController extends Controller {

  private discordClient: DiscordClient | null = null;
  private discordComments: Array<unknown> = [];

  @get("/word-counter/shaleian")
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

  @get("/word-counter/fennese")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    const apiKey = request.query.apiKey as string;
    const paramName = request.query.paramName as string;
    const result = await axios.get(`https://zpdic.ziphil.com/api/v1/dictionary/${paramName}/words?text=単語&mode=tag&type=exact`, {headers: {"X-Api-Key": apiKey}});
    const count = result.data.total;
    response.json(count).end();
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

  @post("/comment-viewer/discord/start")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    const key = request.body.key as string;
    const channelIds = request.body.channelIds as Array<Snowflake>;
    const firstMessage = request.body.firstMessage as string | undefined;
    if (this.discordClient !== null) {
      this.discordClient.destroy();
    }
    const client = new DiscordClient({intents: [
      GatewayIntentBits["Guilds"],
      GatewayIntentBits["GuildMessages"],
      GatewayIntentBits["MessageContent"]
    ]});
    this.discordClient = client;
    await client.login(key);
    if (firstMessage !== undefined) {
      for (const channelId of channelIds) {
        const channel = await client.channels.fetch(channelId);
        if (channel instanceof TextChannel || channel instanceof VoiceChannel) {
          await channel.send(firstMessage);
        }
      }
    }
    client.on("messageCreate", (message) => {
      if (channelIds.indexOf(message.channel.id) >= 0) {
        const messageJson = message.toJSON() as {[key: string]: unknown};
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