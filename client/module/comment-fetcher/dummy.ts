//

import {
  Comment,
  CommentFetcher
} from "./comment-fetcher";


export class DummyCommentFetcher extends CommentFetcher<DummyCommentFetcherConfig> {

  public async start(): Promise<void> {
  }

  public async update(): Promise<Array<Comment>> {
    let length = Math.floor(Math.random() * 3);
    let comments = [...Array(length)].map(() => {
      let author = this.createRandomString(Math.floor(Math.random() * 12));
      let text = this.createRandomSentence(10, Math.floor(Math.random() * 12) + 3);
      let comment = new Comment(author, text);
      return comment;
    });
    return comments;
  }

  private createRandomString(length: number): string {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let string = [...Array(length)].map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
    return string;
  }

  private createRandomSentence(maxWordLength: number, wordSize: number): string {
    let string = [...Array(wordSize)].map(() => this.createRandomString(Math.floor(Math.random() * maxWordLength) + 1)).join(" ");
    return string;
  }

}


export type DummyCommentFetcherConfig = {
  name: "dummy"
};