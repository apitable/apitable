
const map = new Map<Symbol, boolean>();

export const setIsValid = (key: string, value: boolean) => {
  map.set(Symbol.for(key), value);
};

export const getIsValid = (key: string) => {
  return map.get(Symbol.for(key)) ?? true;
};

export const clearValid = () => {
  map.clear();
};
