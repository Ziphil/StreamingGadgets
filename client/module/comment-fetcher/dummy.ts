//

import {
  Comment,
  CommentFetcher
} from "./base";


export class DummyCommentFetcher extends CommentFetcher<DummyCommentFetcherConfig> {

  public async start(): Promise<void> {
  }

  public async update(): Promise<Array<Comment>> {
    let length = Math.floor(Math.random() * 3);
    let comments = [...Array(length)].map(() => {
      let author = DummyCommentFetcher.createRandomString(Math.floor(Math.random() * 12));
      let text = DummyCommentFetcher.createRandomSentence(10, Math.floor(Math.random() * 12) + 3);
      let comment = new Comment("dummy", author, text);
      return comment;
    });
    return comments;
  }

  private static createRandomString(length: number): string {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let string = [...Array(length)].map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
    return string;
  }

  private static createRandomSentence(maxWordLength: number, wordSize: number): string {
    let string = [...Array(wordSize)].map(() => DummyCommentFetcher.createRandomString(Math.floor(Math.random() * maxWordLength) + 1)).join(" ");
    return string;
  }

}


export type DummyCommentFetcherConfig = {
  name: "dummy"
};