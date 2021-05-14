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

  public readonly author: string;
  public readonly text: string;

  public constructor(author: string, text: string) {
    this.author = author;
    this.text = text;
  }

}