//

import * as react from "react";
import {create} from "../create";
import {useGadgetId} from "../hook/id";


export const Html = create(
  "Html",
  function ({
    config
  }: {
    config: HtmlConfig
  }) {

    const id = useGadgetId();

    return (
      <section className={`gadget word-counter ${config.className}`} id={id} dangerouslySetInnerHTML={createHtmlObject(config.html)}>
      </section>
    );

  }
);


function createHtmlObject(html: string): any {
  const object = {} as any;
  object["__html"] = html;
  return object;
}

export type HtmlConfig = {
  name: "html",
  className?: string,
  html: string
};