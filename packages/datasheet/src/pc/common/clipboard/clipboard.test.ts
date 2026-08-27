/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export {};

jest.mock(
  '@apitable/core',
  () => ({
    FieldType: { Member: 'Member' },
    Range: { bindModel: jest.fn() },
    Selectors: {
      getVisibleColumns: jest.fn(),
      getFieldMap: jest.fn(),
      getLinkId: jest.fn(),
    },
    StoreActions: { loadLackUnitMap: jest.fn() },
    Strings: {},
    getRecordChunkSize: jest.fn(() => 500),
    t: jest.fn(),
  }),
  { virtual: true },
);
jest.mock('pc/store', () => ({ store: { getState: jest.fn(), dispatch: jest.fn() } }), { virtual: true });
jest.mock('pc/components/common/message/message', () => ({ Message: { warning: jest.fn() } }), { virtual: true });
jest.mock('pc/components/common/modal/modal/modal', () => ({ Modal: { confirm: jest.fn() } }), { virtual: true });
jest.mock('pc/components/common/notify', () => ({ notify: { open: jest.fn() } }), { virtual: true });
jest.mock('pc/components/common/notify/notify.interface', () => ({ NotifyKey: { Paste: 'Paste' } }), { virtual: true });
jest.mock('pc/utils/upload_manager', () => ({ UploadManager: class UploadManager {} }), { virtual: true });
jest.mock('../../../modules/shared/browser', () => ({ browser: null }));
jest.mock('../../../modules/shared/shortcut_key/shortcut_key', () => ({ ShortcutContext: { context: { isEditing: jest.fn() } } }));
jest.mock('./clip_data_url_recog', () => ({ recogClipboardURLData: jest.fn() }));
jest.mock('./serializer', () => ({ Serializer: {} }));

const { Clipboard } = require('./clipboard') as typeof import('./clipboard');
const core: any = jest.requireMock('@apitable/core');
const storeModule: any = jest.requireMock('pc/store');

const action = { type: 'load' };
const state = { pageParams: { datasheetId: 'dst' } };
const oneCell = (data: unknown[]) => ({ header: [{}], body: [[{ data }]] }) as any;

describe('Clipboard.updateMemberInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storeModule.store.getState.mockReturnValue(state);
    core.Range.bindModel.mockReturnValue({ toNumberBaseRange: jest.fn(() => ({ column: 0, columnCount: 1 })) });
    core.Selectors.getVisibleColumns.mockReturnValue([{ fieldId: 'member' }]);
    core.Selectors.getFieldMap.mockReturnValue({ member: { type: core.FieldType.Member } });
    core.Selectors.getLinkId.mockReturnValue('link-1');
    core.StoreActions.loadLackUnitMap.mockReturnValue(action);
  });

  const updateMemberInfo = (table: any) => new Clipboard({} as any, {} as any).updateMemberInfo(table, {} as any);

  it('does not load member info when a single pasted member cell is empty', () => {
    expect(() => updateMemberInfo(oneCell([]))).not.toThrow();
    expect(core.StoreActions.loadLackUnitMap).not.toHaveBeenCalled();
    expect(storeModule.store.dispatch).not.toHaveBeenCalled();
  });

  it('loads member info when a single pasted member cell has data', () => {
    updateMemberInfo(oneCell([{ text: 'Alice' }]));

    expect(core.StoreActions.loadLackUnitMap).toHaveBeenCalledWith('Alice', 'link-1');
    expect(storeModule.store.dispatch).toHaveBeenCalledWith(action);
  });
});
