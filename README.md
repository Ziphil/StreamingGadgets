<div align="center">
<h1>動画配信用ガジェット集</h1>
</div>


## 概要
コメントビューアを始めとする、動画配信の際に便利なガジェットを描画するアプリケーションです。
HTML を使って描画するので、OBS Studio などの HTML を表示できる配信ソフトとともに利用することができます。

## 使い方
このリポジトリをクローンして、以下を実行してください。
```
npm run build
npm start
```
後で述べる設定ファイルの形式に従って JSON ファイル (と CSS ファイル) を用意しておき、以下の URL にアクセスしてください。
なお、URL 中の設定ファイルのパスは URL エンコードする必要があります。
```
http://localhost:8051/?path=(設定ファイルの絶対パス)
```

## 設定ファイルの形式
以下は設定ファイルの例です。
コメントを参照して適切に書き換えて使用してください。
なお、以下では説明のためにコメントを追加していますが、実際の設定ファイルではコメントは利用することができません (構文エラーになります)。
```jsonc
{
  // 描画するガジェットの設定
  // 不要なガジェットがある場合は配列の要素から削除すれば描画されません
  "gadgets": [
    // コメントビューア
    {
      "name": "commentViewer",
      // コメントを取得する配信プラットフォーム
      // 不要なものは配列から削除してください
      "platforms": [
        // YouTube Live
        {
          "name": "youtube",
          "key": "*****",  // YouTube Data API のキー
          "videoId": "*****"  // 配信のビデオ ID
        },
        // ツイキャス
        {
          "name": "twitcasting",
          "key": "*****",  // TwitCasting APIv2 のクライアントキー
          "secret": "*****",  // TwitCasting APIv2 のクライアントシークレット
          "userId": "ziphil"  // ユーザー名
        },
        // Discord
        {
          "name": "discord",
          "key": "*****",  // Discord bot のトークン
          "channelId": "*****"  // コメントを取得するチャンネル ID
        },
        // 描画テスト用のダミープラットフォーム
        {
          "name": "dummy"
        }
      ],
      "interval": 5000  // 更新間隔 (ミリ秒)
    },
    // 辞書の単語数表示
    {
      "name": "wordCounter",
      "path": "*****.xdc",  // ファイル名 (絶対パス)
      "interval": 10000  // 更新間隔 (ミリ秒)
    }
  ],
  "cssPath": "*****.css"  // CSS ファイル名 (絶対パス)
}
```

## 参考文献
- [YouTube Data API キーの取得方法](https://qiita.com/iroiro_bot/items/1016a6a439dfb8d21eca)