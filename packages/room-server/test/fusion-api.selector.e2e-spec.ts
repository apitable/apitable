import { expect } from 'chai';
import { getDefaultHeader, initNestTestApp, successExpect } from '../test/fusion-api.e2e-spec';

describe('FusionApi/Selector (e2e)', () => {
  let app;
  beforeEach(() => {
    jest.setTimeout(60000);
  });

  beforeAll(async () => {
    app = await initNestTestApp();
  });

  it('/records (PATCH 多选字段--array参数异常)', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第二条
              recordId: 'recB06ir98QqB',
              fields: {
                '多选😊': '选项2😊',
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
          message: '[多选😊(fld8F7RCHwXQF)] must be array type',
        });
      });
  });

  it('/records (PATCH 多选字段--option不存在)', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第二条
              recordId: 'recB06ir98QqB',
              fields: {
                '多选😊': ['选项3😊'],
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
          message: `[多选😊(fld8F7RCHwXQF)] '选项3😊' option not exists`,
        });
      });
  });

  it('/records (PATCH 多选字段--修改--选项1)', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第二条
              recordId: 'recB06ir98QqB',
              fields: {
                '多选😊': ['选项1😊'],
              },
            },
          ],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].recordId).to.be.eql('recB06ir98QqB');
        expect(result.data.records[0].fields['多选😊']).to.deep.eql(['选项1😊']);
      });
  });

  it('/records (PATCH 多选字段--修改--选项2)', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第二条
              recordId: 'recB06ir98QqB',
              fields: {
                '多选😊': ['选项1😊', '选项2😊'],
              },
            },
          ],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].recordId).to.be.eql('recB06ir98QqB');
        expect(result.data.records[0].fields['多选😊']).to.deep.eql(['选项1😊', '选项2😊']);
      });
  });

  it('/records (PATCH 单选字段--option不存在)', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第二条
              recordId: 'recB06ir98QqB',
              fields: {
                '单选😭': '单选3😭',
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
          message: `[单选😭(fldkBqYq7E9Ck)] '单选3😭' option not exists`,
        });
      });
  });

  it('/records (PATCH 单选字段--修改--选项1)', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第二条
              recordId: 'recB06ir98QqB',
              fields: {
                '单选😭': '单选1😭',
              },
            },
          ],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].recordId).to.be.eql('recB06ir98QqB');
        expect(result.data.records[0].fields['单选😭']).to.deep.eql('单选1😭');
      });
  });

  it('/records (PATCH 单选字段--修改--选项2)', () => {
    return app
      .inject({
        method: 'PATCH',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        payload: {
          records: [
            {
              // 第二条
              recordId: 'recB06ir98QqB',
              fields: {
                '单选😭': '单选2😭',
              },
            },
          ],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].recordId).to.be.eql('recB06ir98QqB');
        expect(result.data.records[0].fields['单选😭']).to.deep.eql('单选2😭');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
