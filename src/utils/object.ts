export function getDefinedObject<T extends Record<string, unknown>>(object: T) {
  let definedObject: Record<string, unknown> = {};
  if (object) {
    Object.entries(object).forEach(([key, value]) => {
      if (value !== undefined && typeof value !== 'function') {
        definedObject[key] = value;
      }
    });
  }
  return definedObject;
}
