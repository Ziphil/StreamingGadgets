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
  Html,
  HtmlConfig
} from "./gadget/html";
import {
  ProgramMirror,
  ProgramMirrorConfig
} from "./gadget/program-mirror";
import {
  ProgramTimeline,
  ProgramTimelineConfig
} from "./gadget/program-timeline";
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
            ) : (gadgetConfig.name === "programTimeline") ? (
              <ProgramTimeline config={gadgetConfig}/>
            ) : (gadgetConfig.name === "programMirror") ? (
              <ProgramMirror config={gadgetConfig}/>
            ) : (gadgetConfig.name === "html") ? (
              <Html config={gadgetConfig}/>
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
export type GadgetConfig = CommentViewerConfig | WordCounterConfig | ProgramTimelineConfig | ProgramMirrorConfig | HtmlConfig;