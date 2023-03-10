import { parseFilterExpressByOpenFilter, parseInnerFilter, parseOpenFilterByExpress, validateOpenFilter } from 'model/filter_data_structure_parse';
import { FilterConjunction } from 'types';
import { mockMeta, openFilterInfoMock, mockState, innerFilter, expressFilter } from './mock_data';

const openFilter = { [FilterConjunction.And]: openFilterInfoMock[FilterConjunction.And] };

describe('FilterInfo schema conversions & checksums', () => {
  it('Open filterInfo schema calibration - correct structure', () => {
    const { error } = validateOpenFilter({
      and: openFilterInfoMock[FilterConjunction.And]
    }, true);
    expect(Boolean(error)).toEqual(false);
  });

  it('Open filterInfo schema checksum - correct structure - no filter group supported', () => {
    const { error } = validateOpenFilter(openFilter);
    expect(Boolean(error)).toEqual(true);
  });

  it('Open filterInfo schema checksum - with redundant filter groups', () => {
    const { error } = validateOpenFilter({
      and: openFilterInfoMock
    });
    expect(Boolean(error)).toEqual(true);
  });

  it('Open filterInfo schema checksum - empty object', () => {
    const { error } = validateOpenFilter({});
    expect(Boolean(error)).toEqual(false);
  });

  it('Open filter parse inner', () => {
    const res = parseInnerFilter(openFilter, { fieldMap: mockMeta.fieldMap, state: mockState });
    expect(JSON.stringify(res).length).toEqual(JSON.stringify(innerFilter).length);
  });

  it('Open filter parse express', () => {
    const res = parseFilterExpressByOpenFilter(openFilter, { fieldMap: mockMeta.fieldMap, state: mockState });
    expect(res).toEqual(expressFilter);
  });

  it('Express filter parse open', () => {
    const res = parseOpenFilterByExpress(expressFilter, { meta: mockMeta, state: mockState });
    expect(res).toEqual(openFilter);
  });
});
