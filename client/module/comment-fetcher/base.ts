//


export abstract class CommentFetcher<C = unknown> {

  protected readonly config: C;

  public constructor(config: C) {
    this.config = config;
  }

  public abstract start(): Promise<void>;

  public abstract update(): Promise<Array<Comment>>;

}


export class Comment {

  public readonly platform: string;
  public readonly author: string;
  public readonly text: string;

  public constructor(platform: string, author: string, text: string) {
    this.platform = platform;
    this.author = author;
    this.text = text;
  }

}