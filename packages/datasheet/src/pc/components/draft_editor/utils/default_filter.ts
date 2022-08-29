import { Api, IUnitValue } from '@vikadata/core';

export const defaultSuggestionsFilter = async(
  searchValue: string,
): Promise<IUnitValue[]> => {
  const value = searchValue.toLowerCase();
  return await loadOrSearch(value);
};

async function loadOrSearch(keyword: string) {
  const res = await Api.loadOrSearch({ keyword });
  const { data: { data: resData, success }} = res;
  if (!resData.length || !success) {
    return [];
  }
  return resData;
}
