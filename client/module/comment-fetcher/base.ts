//

import {
  ReactNode
} from "react";


export abstract class CommentFetcher<C extends CommentFetcherConfig = CommentFetcherConfig> {

  protected readonly config: C;
  public readonly interval: number;

  public constructor(config: C) {
    this.config = config;
    this.interval = config.interval;
  }

  public abstract start(): Promise<void>;

  public abstract update(): Promise<Array<Comment>>;

}


export class Comment {

  public readonly platformName: string;
  public readonly author: ReactNode;
  public readonly text: ReactNode;

  public constructor(platformName: string, author?: ReactNode, text?: ReactNode) {
    this.platformName = platformName;
    this.author = author ?? null;
    this.text = text ?? null;
  }

}


export type CommentFetcherConfig = {
  name: string,
  interval: number
};