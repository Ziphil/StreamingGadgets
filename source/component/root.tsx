//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";


export class Root extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div className="root">
        Hello, React!
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
};