import { expect } from 'chai';
import { getDefaultHeader, initNestTestApp, successExpect } from '../test/fusion-api.e2e-spec';

describe('FusionApi/CheckBox (e2e)', () => {
  let app;
  beforeEach(() => {
    jest.setTimeout(60000);
  });

  beforeAll(async () => {
    app = await initNestTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/records (PATCH 勾选字段--非boolean值)', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第4条
              recordId: 'recu47OrktaeF',
              fields: {
                勾选: 1,
                日期: Date.now(),
              },
            },
          ],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        expect(response.statusCode).to.be.eql(400);
        expect(response.json(response.payload)).to.deep.eql({
          success: false,
          code: 400,
          message: `[勾选(fld8RJEjTwaBI)] must be boolean type`,
        });
      });
  });

  it('/records (PATCH 勾选字段--false)', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第4条
              recordId: 'recu47OrktaeF',
              fields: {
                勾选: false,
                日期: Date.now(),
              },
            },
          ],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].fields.勾选).to.deep.eql(undefined);
      });
  });

  it('/records (PATCH 勾选字段--true)', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第4条
              recordId: 'recu47OrktaeF',
              fields: {
                勾选: true,
                日期: Date.now(),
              },
            },
          ],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].fields.勾选).to.deep.eql(true);
      });
  });
});
