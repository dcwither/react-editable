type Record = { [x: string]: any };

export default function omit(
  obj: Record | null | undefined,
  keysToOmit: string[]
) {
  return Object.keys(obj || {}).reduce((result: Record, key: string) => {
    if (keysToOmit.indexOf(key) === -1) result[key] = (obj as Record)[key];
    return result;
  }, {});
}
