//

import {nanoid} from "nanoid";
import * as react from "react";
import {useCallback, useMemo, useState} from "react";
import {create} from "../create";
import {useGadgetId} from "../hook/id";
import {ProgramSpec} from "./program-timeline";


export const ProgramMirror = create(
  "ProgramMirror",
  function ({
    config
  }: {
    config: ProgramMirrorConfig
  }) {

    const id = useGadgetId();
    const [ongoingIndex, setOngoingIndex] = useState<number>(0);

    const proceed = useCallback(function (): void {
      setOngoingIndex((ongoingIndex) => (ongoingIndex + 1) % config.programSpecs.length);
    }, []);

    const indexedProgramSpecs = useMemo(() => {
      const indexedProgramSpecs = config.programSpecs.map((spec, index) => ({...spec, index, id: nanoid()}));
      return indexedProgramSpecs;
    }, []);
    const displayedProgramSpec = indexedProgramSpecs[ongoingIndex ?? 0];

    return (
      <section className={`gadget program-mirror ${config.className}`} id={id} onClick={proceed}>
        <div className="display">{config.soundOnlyText}</div>
        <ProgramView spec={displayedProgramSpec} titleCaption={config.titleCaption} presenterCaption={config.presenterCaption}/>
      </section>
    );

  }
);


const ProgramView = create(
  function ({
    spec,
    titleCaption,
    presenterCaption
  }: {
    spec: ProgramSpec,
    titleCaption: string,
    presenterCaption: string
  }) {

    const node = (
      <div className="info">
        <div className="info-title-container">
          <div className="info-caption info-title-caption">{titleCaption}</div>
          <div className="info-title">{spec.title}</div>
        </div>
        <div className="info-presenter-container">
          <div className="info-caption info-presenter-caption">{presenterCaption}</div>
          <div className="info-presenter">{spec.presenter ?? "—"}</div>
        </div>
      </div>
    );
    return node;

  }
);


export type ProgramMirrorConfig = {
  name: "programMirror",
  className?: string,
  programSpecs: Array<ProgramSpec>,
  soundOnlyText: string,
  titleCaption: string,
  presenterCaption: string
};