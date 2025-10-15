//

import axios from "axios";
import {Comment, CommentFetcher} from "./base";


export class TwitcastingCommentFetcher extends CommentFetcher<TwitcastingCommentFetcherConfig> {

  private movieId?: string;
  private lastCommentId?: string;

  public async start(): Promise<void> {
    const movieId = await this.fetchMovieId();
    this.movieId = movieId;
    console.log({movieId});
  }

  public async update(): Promise<Array<Comment>> {
    await this.updateMovieId();
    const comments = await this.fetchComments();
    console.log({comments});
    return comments;
  }

  private async fetchMovieId(): Promise<string | undefined> {
    const key = this.config.key;
    const secret = this.config.secret;
    const userId = this.config.userId;
    const path = `users/${userId}/current_live`;
    const params = {key, secret, path};
    try {
      const data = await axios.get("/api/comment-viewer/twitcasting", {params}).then((response) => response.data);
      const movieId = data["movie"]["id"];
      return movieId;
    } catch (error) {
      return undefined;
    }
  }

  private async updateMovieId(): Promise<void> {
    const movieId = await this.fetchMovieId();
    if (this.movieId !== movieId) {
      this.movieId = movieId;
      this.lastCommentId = undefined;
    }
  }

  private async fetchComments(): Promise<Array<Comment>> {
    if (this.movieId !== undefined) {
      const key = this.config.key;
      const secret = this.config.secret;
      const movieId = this.movieId;
      const path = `movies/${movieId}/comments?limit=50` + ((this.lastCommentId !== undefined) ? `&slice_id=${this.lastCommentId}` : "");
      const params = {key, secret, path};
      try {
        const data = await axios.get("/api/comment-viewer/twitcasting", {params}).then((response) => response.data);
        const items = data["comments"] as Array<any>;
        const comments = items.reverse().map((item) => {
          const author = item["from_user"]["name"];
          const text = item["message"];
          this.lastCommentId = item["id"];
          return {platformName: "twitcasting", author, text};
        });
        return comments;
      } catch (error) {
        return [];
      }
    } else {
      return [];
    }
  }

}


export type TwitcastingCommentFetcherConfig = {
  name: "twitcasting",
  key: string,
  secret: string,
  userId: string,
  interval: number
};