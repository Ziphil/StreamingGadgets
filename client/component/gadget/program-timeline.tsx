//

import {
  nanoid
} from "nanoid";
import * as react from "react";
import {
  useCallback,
  useMemo,
  useState
} from "react";
import {
  create
} from "../create";
import {
  useGadgetId
} from "../hook/id";


export const ProgramTimeline = create(
  "ProgramTimeline",
  function ({
    config
  }: {
    config: EventTimelineConfig
  }) {

    const id = useGadgetId();
    const [ongoingIndex, setOngoingIndex] = useState<number | null>(0);

    const proceed = useCallback(function (): void {
      setOngoingIndex((ongoingIndex) => ((ongoingIndex ?? -1) + 1) % config.programSpecs.length);
    }, []);

    const indexedProgramSpecs = useMemo(() => {
      const dummiedProgramSpecs = config.fillDummy ? [...config.programSpecs, ...Array.from({length: config.displayedCount.max}).map(() => DUMMY_PROGRAM_SPEC)] : config.programSpecs;
      const indexedProgramSpecs = dummiedProgramSpecs.map((spec, index) => ({...spec, index, id: nanoid()}));
      return indexedProgramSpecs;
    }, []);

    const displayedProgramSpecs = indexedProgramSpecs.slice(Math.max((ongoingIndex ?? 0) - (config.displayedCount.before ?? 0), 0)).slice(0, config.displayedCount.max);
    const node = (
      <section className={`gadget timeline ${config.className}`} id={id} onClick={proceed}>
        <div className="title">{config.title}</div>
        <div className="program-list">
          {displayedProgramSpecs.map((spec) => (
            <ProgramView key={spec.id} spec={spec} ongoing={"index" in spec && ongoingIndex === spec.index}/>
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
    spec: ProgramSpec & {dummy?: boolean},
    ongoing: boolean
  }) {

    const node = (
      <div className="program" data-ongoing={ongoing} data-dummy={spec.dummy ?? false}>
        <div className="program-next"/>
        <div className="program-main">
          <div className="program-title-container">
            <div className="program-number">{spec.number}</div>
            <div className="program-title-main">
              <div className="program-time">
                <span className="program-time-segment program-time-segment-start">{spec.time.start ?? "?"}</span>
                <span className="program-time-separator">–</span>
                <span className="program-time-segment program-time-segment-end">{spec.time.end ?? ""}</span>
              </div>
              <div className="program-title">{spec.title}</div>
            </div>
          </div>
          <div className="program-presenter-container">
            <div className="program-presenter-by"/>
            <div className="program-presenter">{spec.presenter ?? "—"}</div>
          </div>
        </div>
      </div>
    );
    return node;

  }
);


export type EventTimelineConfig = {
  name: "programTimeline",
  className?: string,
  title: string,
  programSpecs: Array<ProgramSpec>,
  displayedCount: {max: number, before?: number},
  fillDummy?: boolean
};
export type ProgramSpec = {
  number: number | null,
  time: {start: string | null, end: string | null},
  title: string,
  presenter: string | null
};

const DUMMY_PROGRAM_SPEC = {
  number: 1,
  time: {start: "00:00", end: "00:00"},
  title: "Dummy",
  presenter: "Dummy",
  dummy: true
};