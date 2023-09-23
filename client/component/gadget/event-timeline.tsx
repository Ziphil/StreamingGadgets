//

import * as react from "react";
import {
  useState
} from "react";
import {
  create
} from "../create";
import {
  useGadgetId
} from "../hook/id";


export const EventTimeline = create(
  "EventTimeline",
  function ({
    config
  }: {
    config: EventTimelineConfig
  }) {

    const id = useGadgetId();
    const [ongoingIndex, setOngoingIndex] = useState<number | null>(0);

    const node = (
      <section className={`gadget timeline ${config.className}`} id={id}>
        <div className="title">{config.title}</div>
        <div className="program-list">
          {config.programSpecs.map((programSpec, index) => (
            <ProgramView key={index} spec={programSpec} ongoing={ongoingIndex === index}/>
          ))}
        </div>
      </section>
    );
    return node;

  }
);


const ProgramView = create(
  function ({
    spec,
    ongoing
  }: {
    spec: ProgramSpec,
    ongoing: boolean
  }) {

    const node = (
      <div className="program" data-ongoing={ongoing}>
        <div className="program-next"></div>
        <div className="program-main">
          <div className="program-title-container">
            <div className="program-number">{spec.number}</div>
            <div className="program-title-main">
              <div className="program-time">
                <span className="program-time-segment program-time-segment-start">{spec.time.start}</span>
                <span className="program-time-separator">–</span>
                <span className="program-time-segment program-time-segment-end">{spec.time.end}</span>
              </div>
              <div className="program-title">{spec.title}</div>
            </div>
          </div>
          <div className="program-presenter-container">
            <div className="program-presenter-by">BY</div>
            <div className="program-presenter">{spec.presenter ?? "—"}</div>
          </div>
        </div>
      </div>
    );
    return node;

  }
);


export type EventTimelineConfig = {
  name: "eventTimeline",
  className?: string,
  title: string,
  programSpecs: Array<ProgramSpec>
};
export type ProgramSpec = {
  number: number | null,
  time: {start: string, end: string},
  title: string,
  presenter: string | null
};