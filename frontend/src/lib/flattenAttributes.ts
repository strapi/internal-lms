//@ts-expect-error // Ignore TS types for this file

export const flattenAttributes = (data) => {
  if (typeof data !== 'object' || data === null || data instanceof Date) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(flattenAttributes);
  }

  const flattened = {};

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (
        (key === 'attributes' || key === 'data') &&
        typeof value === 'object' &&
        !Array.isArray(value)
      ) {
        Object.assign(flattened, flattenAttributes(value));
      } else {
        // @ts-expect-error Ifnore TS types for this file
        flattened[key] = flattenAttributes(value);
      }
    }
  }

  return flattened;
};

export default flattenAttributes;