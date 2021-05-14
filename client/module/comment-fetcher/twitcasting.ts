//

import axios from "axios";
import {
  Comment,
  CommentFetcher
} from "./base";


export class TwitcastingCommentFetcher extends CommentFetcher<TwitcastingCommentFetcherConfig> {

  private movieId?: string;
  private lastCommentId?: string;

  public async start(): Promise<void> {
    let movieId = await this.fetchMovieId();
    this.movieId = movieId;
    console.log({movieId});
  }

  public async update(): Promise<Array<Comment>> {
    let comments = await this.fetchComments();
    console.log({comments});
    return comments;
  }

  private async fetchMovieId(): Promise<string | undefined> {
    let key = this.config.key;
    let secret = this.config.secret;
    let userId = this.config.userId;
    let path = `users/${userId}/current_live`;
    let params = {key, secret, path};
    try {
      let data = await axios.get("/interface/twitcasting", {params}).then((response) => response.data);
      let movieId = data["movie"]["id"];
      return movieId;
    } catch (error) {
      return undefined;
    }
  }

  private async fetchComments(): Promise<Array<Comment>> {
    if (this.movieId !== undefined) {
      let key = this.config.key;
      let secret = this.config.secret;
      let movieId = this.movieId;
      let path = `movies/${movieId}/comments?limit=50` + ((this.lastCommentId !== undefined) ? `&slice_id=${this.lastCommentId}` : "");
      let params = {key, secret, path};
      try {
        let data = await axios.get("/interface/twitcasting", {params}).then((response) => response.data);
        let items = data["comments"] as Array<any>;
        let comments = items.reverse().map((item) => {
          let author = item["from_user"]["name"];
          let text = item["message"];
          this.lastCommentId = item["id"];
          return new Comment(author, text);
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
};