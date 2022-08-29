import { expect } from 'chai';
import { getDefaultHeader, initNestTestApp, successExpect } from '../test/fusion-api.e2e-spec';

describe('FusionApi/Member (e2e)', () => {
  let app;
  beforeEach(() => {
    jest.setTimeout(60000);
  });

  beforeAll(async() => {
    app = await initNestTestApp();
  });

  afterAll(async() => {
    await app.close();
  });

  it('/records (PATCH 成员字段--成员名字错误)', () => {
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
                成员: [
                  {
                    unitType: 3,
                    unitName: '郑旭11111',
                  },
                ],
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
          message: "[成员(fldjNxfA5Es3A)] 'with value: [{'unitType': 3, 'unitName': '郑旭11111'}]' not exists",
        });
      });
  });

  it('/records (PATCH 成员字段--require字段验证)', () => {
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
                成员: [
                  {
                    unitName: '郑旭',
                  },
                ],
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
          message: "[成员(fldjNxfA5Es3A)] 'unitType' required",
        });
      });
  });

  it('/records (PATCH 成员字段--unitId数据类型验证)', () => {
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
                成员: [
                  {
                    unitId: 1236181428773851139,
                    unitType: 3,
                    unitName: '郑旭',
                  },
                ],
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
          message: "[成员(fldjNxfA5Es3A)] 'unitId' must be string type",
        });
      });
  });

  it('/records (PATCH 成员字段-成员unitId不存在验证)', () => {
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
                成员: [
                  {
                    unitId: '12361814287738511391',
                    unitType: 3,
                    unitName: '郑旭',
                  },
                ],
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
          message: "[成员(fldjNxfA5Es3A)] 'unitId:12361814287738511391' not exists",
        });
      });
  });

  it('/records (PATCH 成员字段--郑旭)', () => {
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
                成员: [
                  {
                    unitId: '1236181428773851139',
                    unitType: 3,
                    unitName: '郑旭',
                  },
                ],
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
        expect(result.data.records[0].fields.成员[0].unitId).to.be.eql('1236181428773851139');
        expect(result.data.records[0].fields.成员[0].unitName).to.be.eql('郑旭');
        expect(result.data.records[0].fields.成员[0].unitType).to.be.eql(3);
      });
  });

  it('/records (PATCH 成员字段--陈伯超)', () => {
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
                成员: [
                  {
                    unitId: '1236159947884990467',
                    unitType: 3,
                    unitName: '陈伯超',
                  },
                ],
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
        expect(result.data.records[0].fields.成员[0].unitId).to.be.eql('1236159947884990467');
        expect(result.data.records[0].fields.成员[0].unitName).to.be.eql('陈伯超');
        expect(result.data.records[0].fields.成员[0].unitType).to.be.eql(3);
      });
  });
});
