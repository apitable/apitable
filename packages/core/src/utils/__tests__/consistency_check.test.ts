import { IFieldMap, IRecordMap, ISnapshot, IViewProperty, ViewType } from 'exports/store';
import { range } from 'lodash';
import { FieldType } from 'types';
import { consistencyCheck } from 'utils/consistency_check';

const mockSnapshot = (views: IViewProperty[]): ISnapshot => {
  const mockFieldMap: IFieldMap = {
    fld1: {
      id: 'fld1',
      name: 'Field 1',
      type: FieldType.SingleText,
      property: {},
    },
    fld2: {
      id: 'fld2',
      name: 'Field 2',
      type: FieldType.MultiSelect,
      property: {
        options: [
          {
            id: 'opt1',
            name: 'Option 1',
            color: 0,
          },
          {
            id: 'opt2',
            name: 'Option 2',
            color: 0,
          },
        ],
        defaultValue: ['opt2'],
      },
    },
    fld3: {
      id: 'fld3',
      name: 'Field 3',
      type: FieldType.Email,
      property: null,
    },
  };

  const mockRecordMap: IRecordMap = range(1, 101).reduce((obj, i) => {
    obj['rec' + i] = {
      id: 'rec' + i,
      data: {},
      commentCount: 0,
    };
    return obj;
  }, {});

  return {
    meta: {
      fieldMap: mockFieldMap,
      views,
    },
    recordMap: mockRecordMap,
    datasheetId: 'dst1',
  };
};

const mockDefaultView = (viewId: string): IViewProperty => ({
  id: viewId,
  name: viewId.toUpperCase(),
  type: ViewType.Grid,
  rows: range(1, 101).map(i => ({ recordId: 'rec' + i })),
  columns: [1, 2, 3].map(i => ({ fieldId: 'fld' + i })),
  frozenColumnCount: 1,
});

describe('consistent', () => {
  it('should return null for successful check', () => {
    const result = consistencyCheck(
      mockSnapshot([
        mockDefaultView('viw1'),
        {
          id: 'viw2',
          name: 'View 2',
          type: ViewType.Grid,
          rows: range(100, 0, -1).map(i => ({ recordId: 'rec' + i })),
          columns: [2, 3, 1].map(i => ({ fieldId: 'fld' + i })),
          frozenColumnCount: 1,
        },
      ]),
    );
    expect(result).toStrictEqual(null);
  });

  it('should succeed for empty rows', () => {
    const snapshot = mockSnapshot([
      {
        id: 'viw1',
        name: 'View 1',
        type: ViewType.Grid,
        rows: [],
        columns: [1, 2, 3].map(i => ({ fieldId: 'fld' + i })),
        frozenColumnCount: 1,
      },
    ]);
    snapshot.recordMap = {};
    const result = consistencyCheck(snapshot);
    expect(result).toStrictEqual(null);
  });
});

describe('duplicate views', () => {
  it('does not include first occurrence', () => {
    const result = consistencyCheck(
      mockSnapshot([
        mockDefaultView('viw1'),
        {
          id: 'viw2',
          name: 'View 2',
          type: ViewType.Grid,
          rows: range(100, 0, -1).map(i => ({ recordId: 'rec' + i })),
          columns: [2, 3, 1].map(i => ({ fieldId: 'fld' + i })),
          frozenColumnCount: 1,
        },
        mockDefaultView('viw1'),
      ]),
    );
    expect(result).toStrictEqual([
      {
        duplicateViews: [2],
      },
    ]);
  });

  test('multiple duplicate views', () => {
    const view3: IViewProperty = {
      id: 'viw3',
      name: 'View 3',
      type: ViewType.Grid,
      rows: range(100, 0, -1).map(i => ({ recordId: 'rec' + i })),
      columns: [2, 3, 1].map(i => ({ fieldId: 'fld' + i })),
      frozenColumnCount: 1,
    };
    const result = consistencyCheck(
      mockSnapshot([
        mockDefaultView('viw1'),
        view3,
        {
          id: 'viw2',
          name: 'View 2',
          type: ViewType.Grid,
          rows: range(100, 0, -1).map(i => ({ recordId: 'rec' + i })),
          columns: [2, 3, 1].map(i => ({ fieldId: 'fld' + i })),
          frozenColumnCount: 1,
        },
        view3,
        mockDefaultView('viw1'),
        mockDefaultView('viw4'),
        mockDefaultView('viw1'),
      ]),
    );
    expect(result).toStrictEqual([
      {
        duplicateViews: [3, 4, 6],
      },
    ]);
  });
});

describe('view rows errors', () => {
  describe('view rows different from snapshot.recordMap', () => {
    test('view missing rows', () => {
      const view1 = mockDefaultView('viw1');
      view1.rows = view1.rows.filter(row => !['rec2', 'rec12', 'rec7'].includes(row.recordId));
      const result = consistencyCheck(mockSnapshot([view1]));
      expect(result).toStrictEqual([
        {
          viewId: 'viw1',
          viewName: 'VIW1',
          recordsInMap: range(1, 101).map(i => 'rec' + i),
          notExistInViewRow: ['rec2', 'rec7', 'rec12'],
          notExistInRecordMap: [],
        },
      ]);
    });

    test('view redundant rows', () => {
      const view1 = mockDefaultView('viw1');
      view1.rows.push({ recordId: 'rec300' });
      view1.rows.splice(74, 0, { recordId: 'recABC' });
      view1.rows.unshift({ recordId: 'rec5555' });
      const result = consistencyCheck(mockSnapshot([view1]));
      expect(result).toStrictEqual([
        {
          viewId: 'viw1',
          viewName: 'VIW1',
          recordsInMap: range(1, 101).map(i => 'rec' + i),
          notExistInRecordMap: ['rec5555', 'recABC', 'rec300'],
          notExistInViewRow: [],
        },
      ]);
    });

    test('view rows diff', () => {
      const view1 = mockDefaultView('viw1');
      view1.rows = view1.rows.filter(row => !['rec2', 'rec12', 'rec7'].includes(row.recordId));
      view1.rows.push({ recordId: 'rec300' });
      view1.rows.splice(74, 0, { recordId: 'recABC' });
      view1.rows.unshift({ recordId: 'rec5555' });
      const result = consistencyCheck(mockSnapshot([view1]));
      expect(result).toStrictEqual([
        {
          viewId: 'viw1',
          viewName: 'VIW1',
          recordsInMap: range(1, 101).map(i => 'rec' + i),
          notExistInViewRow: ['rec2', 'rec7', 'rec12'],
          notExistInRecordMap: ['rec5555', 'recABC', 'rec300'],
        },
      ]);
    });

    test('replaceRows', () => {
      const view1 = mockDefaultView('viw1');
      view1.rows = range(1000, 1200)
        .map(i => ({ recordId: 'rec' + i }))
        .concat([{ recordId: 'rec3' }]);
      const result = consistencyCheck(mockSnapshot([view1]));
      expect(result).toStrictEqual([
        {
          viewId: 'viw1',
          viewName: 'VIW1',
          recordsInMap: range(1, 101).map(i => 'rec' + i),
          replaceRows: true,
        },
      ]);
    });
  });

  describe('duplicate rows', () => {
    it('does not include first occurrence', () => {
      const view1 = mockDefaultView('viw1');
      view1.rows.splice(32, 0, { recordId: 'rec78' });
      const result = consistencyCheck(mockSnapshot([view1]));
      expect(result).toStrictEqual([
        {
          viewId: 'viw1',
          viewName: 'VIW1',
          recordsInMap: range(1, 101).map(i => 'rec' + i),
          duplicateRows: [78],
        },
      ]);
    });

    it('multiple duplicate rows', () => {
      const view1 = mockDefaultView('viw1');
      view1.rows.splice(32, 0, { recordId: 'rec78' });
      view1.rows.splice(1, 0, { recordId: 'rec12' });
      view1.rows.splice(100, 0, { recordId: 'rec78' });
      const result = consistencyCheck(mockSnapshot([view1]));
      expect(result).toStrictEqual([
        {
          viewId: 'viw1',
          viewName: 'VIW1',
          recordsInMap: range(1, 101).map(i => 'rec' + i),
          duplicateRows: [100, 12, 79],
        },
      ]);
    });
  });
});

describe('view columns errors', () => {
  describe('view columns different from snapshot.meta.fieldMap', () => {
    test('view missing columns', () => {
      const view1 = mockDefaultView('viw1');
      view1.columns = [{ fieldId: 'fld2' }];
      const result = consistencyCheck(mockSnapshot([view1]));
      expect(result).toStrictEqual([
        {
          viewId: 'viw1',
          viewName: 'VIW1',
          recordsInMap: range(1, 101).map(i => 'rec' + i),
          notExistInViewColumn: ['fld1', 'fld3'],
          notExistInFieldMap: [],
        },
      ]);
    });

    test('view redundant columns', () => {
      const view1 = mockDefaultView('viw1');
      view1.columns.push({ fieldId: 'fldA' });
      view1.columns.splice(1, 0, { fieldId: 'fldB' });
      view1.columns.unshift({ fieldId: 'fldC' });
      const result = consistencyCheck(mockSnapshot([view1]));
      expect(result).toStrictEqual([
        {
          viewId: 'viw1',
          viewName: 'VIW1',
          recordsInMap: range(1, 101).map(i => 'rec' + i),
          notExistInFieldMap: ['fldC', 'fldB', 'fldA'],
          notExistInViewColumn: [],
        },
      ]);
    });

    test('view columns diff', () => {
      const view1 = mockDefaultView('viw1');
      view1.columns = ['fldA', 'fld3', 'fldB', 'fldC'].map(id => ({ fieldId: id }));
      const result = consistencyCheck(mockSnapshot([view1]));
      expect(result).toStrictEqual([
        {
          viewId: 'viw1',
          viewName: 'VIW1',
          recordsInMap: range(1, 101).map(i => 'rec' + i),
          notExistInViewColumn: ['fld1', 'fld2'],
          notExistInFieldMap: ['fldA', 'fldB', 'fldC'],
        },
      ]);
    });
  });

  describe('duplicate columns', () => {
    it('does not include first occurrence', () => {
      const view1 = mockDefaultView('viw1');
      view1.columns.splice(1, 0, { fieldId: 'fld3' });
      const result = consistencyCheck(mockSnapshot([view1]));
      expect(result).toStrictEqual([
        {
          viewId: 'viw1',
          viewName: 'VIW1',
          recordsInMap: range(1, 101).map(i => 'rec' + i),
          duplicateColumns: [3],
        },
      ]);
    });

    it('multiple duplicate columns', () => {
      const view1 = mockDefaultView('viw1');
      view1.columns = ['fld3', 'fld1', 'fld3', 'fld2', 'fld2', 'fld3'].map(id => ({ fieldId: id }));
      const result = consistencyCheck(mockSnapshot([view1]));
      expect(result).toStrictEqual([
        {
          viewId: 'viw1',
          viewName: 'VIW1',
          recordsInMap: range(1, 101).map(i => 'rec' + i),
          duplicateColumns: [2, 4, 5],
        },
      ]);
    });
  });
});

describe('multiple errors', () => {
  test('multiple errors in one view', () => {
    const view1 = mockDefaultView('viw1');
    view1.rows = range(1, 81)
      .concat([117, 164, 1, 123, 164])
      .map(i => ({ recordId: 'rec' + i }));
    view1.columns = ['fldA', 'fld3', 'fldA'].map(id => ({ fieldId: id }));
    const result = consistencyCheck(mockSnapshot([view1]));
    expect(result).toStrictEqual([
      {
        viewId: 'viw1',
        viewName: 'VIW1',
        recordsInMap: range(1, 101).map(i => 'rec' + i),
        duplicateRows: [82, 84],
        duplicateColumns: [2],
        notExistInViewColumn: ['fld1', 'fld2'],
        notExistInFieldMap: ['fldA'],
        notExistInViewRow: range(81, 101).map(i => 'rec' + i),
        notExistInRecordMap: [117, 164, 123].map(i => 'rec' + i),
      },
    ]);
  });

  test('multiple errors in multiple views', () => {
    const view1 = mockDefaultView('viw1');
    view1.rows = range(1, 81)
      .concat([117, 164, 1, 123, 164])
      .map(i => ({ recordId: 'rec' + i }));

    const view2 = mockDefaultView('viw2');
    view2.rows = [{ recordId: 'recA' }];
    view2.columns = ['fldA', 'fld3', 'fldA'].map(id => ({ fieldId: id }));

    const result = consistencyCheck(mockSnapshot([view1, view2, mockDefaultView('viw3'), mockDefaultView('viw2')]));
    expect(result).toStrictEqual([
      {
        duplicateViews: [3],
      },
      {
        viewId: 'viw1',
        viewName: 'VIW1',
        recordsInMap: range(1, 101).map(i => 'rec' + i),
        duplicateRows: [82, 84],
        notExistInViewRow: range(81, 101).map(i => 'rec' + i),
        notExistInRecordMap: [117, 164, 123].map(i => 'rec' + i),
      },
      {
        viewId: 'viw2',
        viewName: 'VIW2',
        recordsInMap: range(1, 101).map(i => 'rec' + i),
        replaceRows: true,
        duplicateColumns: [2],
        notExistInViewColumn: ['fld1', 'fld2'],
        notExistInFieldMap: ['fldA'],
      },
    ]);
  });
});
