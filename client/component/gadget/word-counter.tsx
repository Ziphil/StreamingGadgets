//

import axios from "axios";
import {
  nanoid
} from "nanoid";
import * as react from "react";
import {
  Component,
  ReactNode
} from "react";


export class WordCounter extends Component<Props, State> {

  public state: State = {
    count: 0,
    id: ""
  };

  public constructor(props: Props) {
    super(props);
    this.state.id = nanoid(10);
  }

  public async componentDidMount(): Promise<void> {
    let interval = this.props.config.interval;
    setInterval(this.update.bind(this), interval);
  }

  private async update(): Promise<void> {
    let path = this.props.config.path;
    let params = {path};
    try {
      let count = await axios.get("/api/word-counter/count", {params}).then((response) => response.data);
      this.setState({count});
    } catch (error) {
    }
  }

  public render(): ReactNode {
    let node = (
      <div className="gadget word-counter" id={this.state.id}>
        <div className="count">{this.state.count}</div>
        <div className="unit">words</div>
      </div>
    );
    return node;
  }

}


type Props = {
  config: WordCounterConfig
};
type State = {
  count: number,
  id: string
};

export type WordCounterConfig = {
  name: "wordCounter",
  path: string,
  interval: number
};