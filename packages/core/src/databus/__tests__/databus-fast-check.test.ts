import { MockDataBus, resetDataLoader } from './mock.databus';
import { ResourceType } from 'types';
import { CollaCommandName, } from 'commands';
import { ExecuteResult } from 'command_manager';
import * as fc from 'fast-check';
import { mockGetViewInfo } from './mock.view';
import * as console from 'console';

const db = MockDataBus.getDatabase();

beforeAll(resetDataLoader);

describe('fast check try', () => {
  const contains = (text: string, pattern: string) => {
    if (text.length > 3) {
      return text.substr(1).indexOf(pattern) === -1;
    } else {
      return text.indexOf(pattern) >= 0;
    }
  };

  test('should always contain itself', () => {
    fc.assert(fc.asyncProperty(fc.string(), (text: string) => {
      return new Promise(resolve => {
        resolve(contains(text, text));
      });
    }), { verbose: true });
  });

});

describe('fast check doCommand Operation', () => {

  test('check revision and datasheet pros after a AddRecords doCommand operation', async() => {
    const dst1 = await db.getDatasheet('dst1', {});
    expect(dst1).toBeTruthy();

    const oldRevision = dst1!.revision;
    expect(oldRevision).toStrictEqual(12);
    let expectRevisionChangedCount = 0;

    await fc.assert(fc.asyncProperty(fc.integer(),
      async(aInt: number) => {
        const result = await dst1!.doCommand(
          {
            cmd: CollaCommandName.AddRecords,
            viewId: 'viw1',
            index: 3,
            count: aInt % 10,
          },
          {},
        );
        // check Revision change count. only the result is success will call saveOps
        if (result.result === ExecuteResult.Success) {
          expectRevisionChangedCount += 1;
        }

        // the id, name, and type field of the Datasheet are not changed.
        const prosEq = (dst1!.id === 'dst1' && dst1!.type === ResourceType.Datasheet && dst1!.name === 'datasheet 1');
        expect(dst1!.id).toStrictEqual('dst1');
        expect(dst1!.type).toStrictEqual(ResourceType.Datasheet);
        expect(dst1!.name).toStrictEqual('datasheet 1');
        return new Promise(resolve => {
          resolve(prosEq);
        });
      }), { verbose: true, timeout: 30000 },
    );
    expect(dst1?.revision).toBe(expectRevisionChangedCount + oldRevision);
  });

  test('check datasheet\'s field count after a AddFields doCommand operation', async() => {
    const dst1 = await db.getDatasheet('dst1', {});
    expect(dst1).toBeTruthy();
    if (dst1 == null) {
      return;
    }
    const dstId = dst1?.id || '';
    const view1 = await dst1!.getView({
      getViewInfo: mockGetViewInfo('dst1', 'viw1'),
    });
    const oldViewColumnCount = view1?.columns.length || 0;
    expect(oldViewColumnCount).toStrictEqual(2);
    let expectFieldAddedCount = 0;
    await fc.assert(fc.asyncProperty(fc.string(), fc.integer({min: 2 , max: 200}),
      async (aStr: string, aInt: number) => {
        const oldFieldCount = Object.keys(dst1.fields).length;
        const result = await dst1!.doCommand(
          {
            cmd: CollaCommandName.AddFields,
            data: [{
              data: {
                id: aStr,
                name: aStr,
                property: null,
                type: 1,
              },
              index: aInt,
              viewId: 'viw1',
            }],
            copyCell: false,
            datasheetId: dstId,
          },
          {},
        );
        // check Revision change count. only the result is success will call saveOps
        if (result.result === ExecuteResult.Success) {
          expectFieldAddedCount += 1;
        }else {
          console.error('some error happens');
        }

        const fieldCount = Object.keys(dst1.fields).length;
        return new Promise(resolve => {
          resolve(fieldCount >= (oldFieldCount + 1));
        });
      }), { verbose: true, timeout: 30000 },
    );
    const view2 = await dst1!.getView({
      getViewInfo: mockGetViewInfo('dst1', 'viw1'),
    });
    expect(view2?.columns.length).toStrictEqual(oldViewColumnCount + expectFieldAddedCount);
  });

});
