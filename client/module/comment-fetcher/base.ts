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


export interface Comment {

  readonly id?: string;
  readonly platformName: string;
  readonly author: ReactNode;
  readonly text: ReactNode;

}


export type CommentFetcherConfig = {
  name: string,
  interval: number
};