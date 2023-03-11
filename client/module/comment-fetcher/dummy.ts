//

import {
  Comment,
  CommentFetcher
} from "./base";


export class DummyCommentFetcher extends CommentFetcher<DummyCommentFetcherConfig> {

  public async start(): Promise<void> {
  }

  public async update(): Promise<Array<Comment>> {
    const config = this.config;
    const length = Math.floor(Math.random() * 3);
    const comments = [...Array(length)].map(() => {
      const author = (config.authorPrefix ?? "") + DummyCommentFetcher.createRandomString(Math.floor(Math.random() * 12));
      const text = (config.textPrefix ?? "") + DummyCommentFetcher.createRandomSentence(10, Math.floor(Math.random() * 12) + 3);
      const comment = {platformName: "dummy", author, text};
      return comment;
    });
    return comments;
  }

  private static createRandomString(length: number): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const string = [...Array(length)].map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
    return string;
  }

  private static createRandomSentence(maxWordLength: number, wordSize: number): string {
    const string = [...Array(wordSize)].map(() => DummyCommentFetcher.createRandomString(Math.floor(Math.random() * maxWordLength) + 1)).join(" ");
    return string;
  }

}


export type DummyCommentFetcherConfig = {
  name: "dummy",
  authorPrefix?: string,
  textPrefix?: string,
  interval: number
};