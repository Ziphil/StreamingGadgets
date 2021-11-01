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
  get,
  post
} from "./decorator";


@controller("/interface")
export class MainController extends Controller {

  private discordClient: DiscordClient | null = null;
  private discordComments: Array<unknown> = [];

  @get("/config")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    let path = request.query.path as string;
    fs.readFile(path, {encoding: "utf-8"}, (error, config) => {
      if (error) {
        next(error);
      } else {
        response.type("application/json").send(config).end();
      }
    });
  }

  @get("/style")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    let path = request.query.path as string;
    fs.readFile(path, {encoding: "utf-8"}, (error, config) => {
      if (error) {
        response.type("text/css").send("").end();
      } else {
        response.type("text/css").send(config).end();
      }
    });
  }

  @get("/local")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    let path = request.query.path as string;
    response.sendFile(path);
  }

  @get("/word-count")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    let path = request.query.path as string;
    fs.readdir(path, (error, names) => {
      if (error) {
        response.json(0).end();
      } else {
        let count = names.filter((name) => name.endsWith(".xdnw")).length;
        response.json(count).end();
      }
    });
  }

  @get("/twitcasting")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    let encodedSecret = encode(`${request.query.key}:${request.query.secret}`);
    let headers = Object.fromEntries([
      ["Accept", "application/json"],
      ["X-Api-Version", "2.0"],
      ["Authorization", `Basic ${encodedSecret}`]
    ]);
    try {
      let result = await axios.get(`https://apiv2.twitcasting.tv/${request.query.path}`, {headers});
      let data = result.data;
      let remaining = result.headers["x-ratelimit-remaining"];
      let resetDate = new Date(parseInt(result.headers["x-ratelimit-reset"]) * 1000).toString();
      response.json({...data, remaining, resetDate}).end();
    } catch (error) {
      response.status(500).end();
    }
  }

  @get("/discord/start")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    let key = request.query.key as string;
    let channelId = request.query.channelId as Snowflake;
    let firstMessage = request.query.firstMessage as string | undefined;
    if (this.discordClient !== null) {
      this.discordClient.destroy();
    }
    let client = new DiscordClient({intents: Intents.ALL});
    this.discordClient = client;
    await client.login(key);
    if (firstMessage !== undefined) {
      let channel = await client.channels.fetch(channelId);
      if (channel instanceof TextChannel) {
        await channel.send(firstMessage);
      }
    }
    client.on("message", (message) => {
      if (message.channel.id === channelId) {
        let messageJson = message.toJSON() as any;
        let authorJson = message.author.toJSON();
        let memberJson = message.member?.toJSON();
        this.discordComments.push({...messageJson, author: authorJson, member: memberJson});
      }
    });
    response.json(true).end();
  }

  @get("/discord")
  public async [Symbol()](request: Request, response: Response, next: NextFunction): Promise<void> {
    let comments = this.discordComments;
    this.discordComments = [];
    response.json(comments).end();
  }

}