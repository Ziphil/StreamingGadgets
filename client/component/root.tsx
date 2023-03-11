//

import * as react from "react";
import {
  Fragment
} from "react";
import {
  create
} from "./create";
import {
  CommentViewer,
  CommentViewerConfig
} from "./gadget/comment-viewer";
import {
  WordCounter,
  WordCounterConfig
} from "./gadget/word-counter";


export const Root = create(
  "Root",
  function ({
    config
  }: {
    config: RootConfig
  }) {

    const node = (
      <Fragment>
        {config.gadgets.map((gadgetConfig, index) => (
          <Fragment key={index}>
            {(gadgetConfig.name === "commentViewer") ? (
              <CommentViewer config={gadgetConfig}/>
            ) : (gadgetConfig.name === "wordCounter") ? (
              <WordCounter config={gadgetConfig}/>
            ) : null}
          </Fragment>
        ))}
      </Fragment>
    );
    return node;

  }
);


export type RootConfig = {
  gadgets: Array<GadgetConfig>,
  cssPath?: string
};
export type GadgetConfig = CommentViewerConfig | WordCounterConfig;