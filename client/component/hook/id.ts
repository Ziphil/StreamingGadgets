import {
  nanoid
} from "nanoid";
import {
  useState
} from "react";


/** ガジェットを識別するための ID を生成します。 */
export function useGadgetId(): string {
  const [id] = useState(nanoid(10));
  return id;
}