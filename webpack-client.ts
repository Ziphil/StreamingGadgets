//

import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";


let config = {
  entry: ["babel-polyfill", "./client/index.tsx"],
  output: {
    path: path.join(__dirname, "dist", "client"),
    publicPath: "",
    filename: "./bundle.js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.json"
          }
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.js$/,
        enforce: "pre",
        loader: "source-map-loader"
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".scss", ".css"]
  },
  devServer: {
    port: 3001,
    historyApiFallback: true,
    contentBase: path.join(__dirname, "dist", "client"),
    proxy: {
      "/interface": "http://localhost:8051"
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/public/index.html",
      title: "Streaming"
    })
  ]
};

export default config;