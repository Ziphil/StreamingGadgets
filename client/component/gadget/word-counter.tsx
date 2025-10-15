//

import axios from "axios";
import * as react from "react";
import {useCallback, useState} from "react";
import {useMount} from "react-use";
import {formatNumber} from "../../module/format-number";
import {create} from "../create";
import {useGadgetId} from "../hook/id";


export const WordCounter = create(
  "WordCounter",
  function ({
    config
  }: {
    config: WordCounterConfig
  }) {

    const id = useGadgetId();
    const [count, setCount] = useState(0);
    const [type, setType] = useState<WordUnitType>("word");

    const changeType = useCallback(function (): void {
      setType((type) => (type === "word") ? "tokipona" : "word");
    }, []);

    const {value, fractionalLength, unit} = getCountSpec(count, type);

    useMount(() => {
      setInterval(async () => {
        const {name, ...params} = config.dictionary;
        try {
          const count = await axios.get(`/api/word-counter/${name}`, {params}).then((response) => response.data);
          setCount(count);
        } catch (error) {
        }
      }, config.interval);
    });

    return (
      <section className={`gadget word-counter ${config.className}`} id={id} onClick={changeType}>
        <div className="value">
          {formatNumber(value, fractionalLength, {
            integerPart: (string) => <span className="digit digit-integer" key="integer">{string}</span>,
            fractionalPart: (string) => <span className="digit digit-fractional" key="fractional">{string}</span>,
            decimal: (string) => <span className="decimal" key="decimal">{string}</span>
          })}
        </div>
        <div className="unit">{unit}</div>
      </section>
    );

  }
);


function getCountSpec(count: number, type: WordUnitType): {value: number, fractionalLength: number, unit: string} {
  if (type === "word") {
    return {value: count, fractionalLength: 0, unit: "words"};
  } else {
    return {value: count / 120, fractionalLength: 2, unit: "TP"};
  }
}

export type WordCounterConfig = {
  name: "wordCounter",
  className?: string,
  dictionary: DictionaryConfigs[keyof DictionaryConfigs],
  interval: number
};
export type WordUnitType = "word" | "tokipona";

export type DictionaryConfigs = {
  shaleian: ShaleianDictionaryConfig,
  fennese: FenneseDictionaryConfig
};
export type ShaleianDictionaryConfig = {
  name: "shaleian",
  path: string
};
export type FenneseDictionaryConfig = {
  name: "fennese",
  paramName: string,
  apiKey: string
};