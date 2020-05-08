export const dictonaryToArray = <T>(dict: {[key: string]: T}) =>
  Object.keys(dict || {}).reduce((result, key) => {
      const item = dict[key]; 
      if (item == null) {
        return result;
      }
      result.push(item);
      return result;
  }, [] as T[]);

