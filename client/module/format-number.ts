//


export function formatNumber<T>(number: number, fractionalLength: number, converter: NumberPartConverter<T>): Array<T> {
  let result = [];
  let integerPart = "" + Math.floor(number);
  result.push(converter.integerPart(integerPart));
  if (fractionalLength >= 1) {
    let fractionalPart = padZero(Math.floor(number * (10 ** fractionalLength)), fractionalLength);
    result.push(converter.decimal("."));
    result.push(converter.fractionalPart(fractionalPart));
  }
  return result;
}

export function padZero(number: number | string, length: number): string {
  let preceding = new Array(length).join("0");
  let result = (preceding + number).slice(-length);
  return result;
}

export type NumberPartConverter<T> = {
  integerPart: (string: string) => T,
  fractionalPart: (string: string) => T,
  decimal: (string: string) => T
};