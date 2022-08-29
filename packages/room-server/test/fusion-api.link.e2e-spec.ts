import { expect } from 'chai';
import { getDefaultHeader, initNestTestApp, successExpect } from '../test/fusion-api.e2e-spec';

describe('FusionApi/Link (e2e)', () => {
  let app;
  beforeEach(() => {
    jest.setTimeout(60000);
  });

  beforeAll(async () => {
    app = await initNestTestApp();
  });

  it('/records (PATCH 神奇关联字段--必须array)', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第5条
              recordId: 'rec4fYoknscKV',
              fields: {
                '神奇关联-单选': 'recmXbcelpy6M',
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
          message: '[神奇关联-单选(fldFprv9UQ0PV)] must be array type',
        });
      });
  });

  it('/records (PATCH 神奇关联字段--单选)', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第5条
              recordId: 'rec4fYoknscKV',
              fields: {
                '神奇关联-单选': ['recmXbcelpy6M', 'reck6eAsAwA0M'],
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
          message: '[神奇关联-单选(fldFprv9UQ0PV)] should only one value',
        });
      });
  });

  it('/records (PATCH 神奇关联字段--关联recordId不存在)', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第5条
              recordId: 'rec4fYoknscKV',
              fields: {
                '神奇关联-单选': ['rescccc'],
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
          message: `'{rescccc}' not exists`,
        });
      });
  });

  it('/records (PATCH 神奇关联字段--修改[]', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第5条
              recordId: 'rec4fYoknscKV',
              fields: {
                '神奇关联-单选': [],
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
          message: `[神奇关联-单选(fldFprv9UQ0PV)] array value can not be empty`,
        });
      });
  });

  it('/records (PATCH 神奇关联字段--修改null', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第5条
              recordId: 'rec4fYoknscKV',
              fields: {
                '神奇关联-单选': null,
              },
            },
          ],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].fields['神奇关联-单选']).to.deep.eql(undefined);
      });
  });

  it('/records (PATCH 神奇关联字段--修改1', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第5条
              recordId: 'rec4fYoknscKV',
              fields: {
                '神奇关联-单选': ['recmXbcelpy6M'],
              },
            },
          ],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].fields['神奇关联-单选']).to.deep.eql(['recmXbcelpy6M']);
      });
  });

  it('/records (PATCH 神奇关联字段--修改2', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第5条
              recordId: 'rec4fYoknscKV',
              fields: {
                '神奇关联-单选': ['reck6eAsAwA0M'],
              },
            },
          ],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].fields['神奇关联-单选']).to.deep.eql(['reck6eAsAwA0M']);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
