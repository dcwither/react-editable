
export default function omit(obj = {}, keysToOmit) {
  return Object.keys(obj).reduce((result, key) => {
    if (key === 'childKey') return result;
    if (keysToOmit.indexOf(key) === -1) result[key] = obj[key];
    return result;
  }, {});
}
