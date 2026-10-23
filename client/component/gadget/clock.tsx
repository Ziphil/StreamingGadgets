//

import * as react from "react";
import {useEffect, useState} from "react";
import {formatFiguredNumber} from "../../module/format-number";
import {create} from "../create";
import {useGadgetId} from "../hook/id";


export const Clock = create(
  "Clock",
  function ({
    config
  }: {
    config: ClockConfig
  }) {

    const id = useGadgetId();
    const [time, setTime] = useState(new Date());

    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();

    useEffect(() => {
      const interval = setInterval(async () => {
        setTime(new Date());
      }, config.interval);
      return () => clearInterval(interval);
    }, []);

    return (
      <section className={`gadget clock ${config.className}`} id={id}>
        <div className="value">
          {formatFiguredNumber(hour, 2, {
            integerPart: (string) => <span className="figure figure-hour" key="integer">{string}</span>
          })}
          <span className="colon colon-minute">:</span>
          {formatFiguredNumber(minute, 2, {
            integerPart: (string) => <span className="figure figure-minute" key="integer">{string}</span>
          })}
          <span className="colon colon-second">:</span>
          {formatFiguredNumber(second, 2, {
            integerPart: (string) => <span className="figure figure-second" key="integer">{string}</span>
          })}
        </div>
      </section>
    );

  }
);


export type ClockConfig = {
  name: "clock",
  className?: string,
  interval: number
};