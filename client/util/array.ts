//


export function toArray<T>(value: T | Array<T>): Array<T> {
  if (Array.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}