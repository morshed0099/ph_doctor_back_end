const pick = async (obj: Record<string, unknown>, keys: string[]) => {
  const finalObject: Record<string, unknown> = {};
  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObject[key] = obj[key];
    }
  }
  return finalObject;
};

export default pick;
