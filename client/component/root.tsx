//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  CommentViewer
} from "./gadget/comment-viewer";


export class Root extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div className="root">
        <CommentViewer/>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
};