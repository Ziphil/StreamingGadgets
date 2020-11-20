//

import {
  Comment,
  CommentFetcher
} from "./comment-fetcher";


export class DummyCommentFetcher extends CommentFetcher {

  public async start(): Promise<void> {
  }

  public async update(): Promise<Array<Comment>> {
    let length = Math.floor(Math.random() * 3);
    let comments = Array.from({length}).map(() => {
      let author = this.createRandomString(Math.floor(Math.random() * 12));
      let text = this.createRandomString(Math.floor(Math.random() * 90) + 10);
      let comment = new Comment(author, text);
      return comment;
    });
    return comments;
  }

  private createRandomString(length: number): string {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let string = Array.from({length}).map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
    return string;
  }

}