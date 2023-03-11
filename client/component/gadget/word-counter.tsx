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
import {
  formatNumber
} from "../../module/format-number";


export class WordCounter extends Component<Props, State> {

  public state: State = {
    count: 0,
    type: "word",
    id: ""
  };

  public constructor(props: Props) {
    super(props);
    this.state.id = nanoid(10);
  }

  public async componentDidMount(): Promise<void> {
    const interval = this.props.config.interval;
    setInterval(this.update.bind(this), interval);
  }

  private changeType(): void {
    const type = this.state.type;
    this.setState({type: (type === "word") ? "tokipona" : "word"});
  }

  private async update(): Promise<void> {
    const path = this.props.config.path;
    const params = {path};
    try {
      const count = await axios.get("/api/word-counter/count", {params}).then((response) => response.data);
      this.setState({count});
    } catch (error) {
    }
  }

  public render(): ReactNode {
    const type = this.state.type;
    const count = this.state.count;
    const value = (type === "word") ? count : count / 120;
    const fractionalLength = (type === "word") ? 0 : 2;
    const unit = (type === "word") ? "words" : "TP";
    const valueNode = formatNumber(value, fractionalLength, {
      integerPart: (string) => <span className="digit integer">{string}</span>,
      fractionalPart: (string) => <span className="digit fractional">{string}</span>,
      decimal: (string) => <span className="decimal">{string}</span>
    });
    const node = (
      <div className="gadget word-counter" id={this.state.id} onClick={this.changeType.bind(this)}>
        <div className="value">{valueNode}</div>
        <div className="unit">{unit}</div>
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
  type: "word" | "tokipona",
  id: string
};

export type WordCounterConfig = {
  name: "wordCounter",
  path: string,
  interval: number
};