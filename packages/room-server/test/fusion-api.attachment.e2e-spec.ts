import { expect } from 'chai';
import { createSuccessExpect, getDefaultHeader, initNestTestApp, successExpect } from '../test/fusion-api.e2e-spec';
import { EnvConfigKey } from 'common';
import { IOssConfig } from 'interfaces';
import { EnvConfigService } from 'config/env.config.service';
import * as path from 'path';
import FormData from 'form-data';
import * as fs from 'fs';

describe('FusionApi/Attachment (e2e)', () => {
  let app;
  let host;
  const insertRecordIds = [];
  beforeEach(() => {
    jest.setTimeout(60000);
  });

  beforeAll(async() => {
    app = await initNestTestApp();
    const oss = app.get(EnvConfigService).getRoomConfig(EnvConfigKey.OSS) as IOssConfig;
    host = oss.host;
  });

  afterAll(async() => {
    await app.close();
  });

  it('/records (PATCH 附件字段--参数array验证)', () => {
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
                附件: {
                  token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
                  preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
                  size: 5008519,
                  height: 0,
                  width: 0,
                  name: '互联网传媒行业：2020微博动漫白皮书.pdf',
                  mimeType: 'application/pdf',
                },
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
          message: '[附件(fldkYoTEDrgRP)] must be array type',
        });
      });
  });

  it('/records (PATCH 附件字段--必传参数验证--token)', () => {
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
                附件: [
                  {
                    preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
                    size: 5008519,
                    height: 0,
                    width: 0,
                    name: '互联网传媒行业：2020微博动漫白皮书.pdf',
                    mimeType: 'application/pdf',
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
          message: '[附件(fldkYoTEDrgRP)] \'token\' must be string type',
        });
      });
  });

  it('/records (PATCH 附件字段--必传参数验证--name)', () => {
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
                附件: [
                  {
                    token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
                    preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
                    size: 5008519,
                    height: 0,
                    width: 0,
                    mimeType: 'application/pdf',
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
          message: '[附件(fldkYoTEDrgRP)] \'name\' must be string type',
        });
      });
  });

  it('/records (PATCH 附件字段--必传参数验证--mimeType)', () => {
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
                附件: [
                  {
                    token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
                    preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
                    size: 5008519,
                    height: 0,
                    width: 0,
                    name: '互联网传媒行业：2020微博动漫白皮书.pdf',
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
          message: '[附件(fldkYoTEDrgRP)] \'mimeType\' must be string type',
        });
      });
  });

  it('/records (PATCH 附件字段--token不存在)', () => {
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
                附件: [
                  {
                    token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ecdddddd',
                    preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
                    size: 5008519,
                    height: 0,
                    width: 0,
                    name: '互联网传媒行业：2020微博动漫白皮书.pdf',
                    mimeType: 'application/pdf',
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
          message: '[附件(fldkYoTEDrgRP)] \'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ecdddddd\' not exists',
        });
      });
  });

  // it('/records (PATCH 附件字段--mimeType传入错误)', () => {
  //   return app
  //     .inject({
  //       method: 'PATCH',
  //       url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
  //       payload: {
  //         records: [
  //           {
  //             // 第5条
  //             recordId: 'rec4fYoknscKV',
  //             fields: {
  //               附件: [
  //                 {
  //                   token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
  //                   preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
  //                   size: 5008519,
  //                   height: 0,
  //                   width: 0,
  //                   name: '互联网传媒行业：2020微博动漫白皮书.pdf',
  //                   mimeType: 'application/txt',
  //                 },
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //       headers: getDefaultHeader(app),
  //     })
  //     .then(response => {
  //       expect(response.statusCode).to.be.eql(400);
  //       expect(response.json(response.payload)).to.deep.eql({
  //         success: false,
  //         code: 400,
  //         message: `[附件(fldkYoTEDrgRP)] wrong mimeType 'application/txt'`,
  //       });
  //     });
  // });

  it('/records (PATCH 附件字段--修改--pdf', () => {
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
                附件: [
                  {
                    token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
                    preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
                    size: 5008519,
                    height: 0,
                    width: 0,
                    name: '互联网传媒行业：2020微博动漫白皮书.pdf',
                    mimeType: 'application/pdf',
                  },
                ],
              },
            },
          ],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].fields.附件[0].token).to.be.eql(
          host + '/space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
        );
        expect(result.data.records[0].fields.附件[0].preview).to.be.eql(
          host + '/space/2020/06/20/166113199f5848e7884207c4b54d521f?imageView2/0/q/100',
        );
        expect(result.data.records[0].fields.附件[0].size).to.be.eql(5008519);
        expect(result.data.records[0].fields.附件[0].height).to.be.eql(0);
        expect(result.data.records[0].fields.附件[0].width).to.be.eql(0);
        expect(result.data.records[0].fields.附件[0].name).to.be.eql('互联网传媒行业：2020微博动漫白皮书.pdf');
        expect(result.data.records[0].fields.附件[0].mimeType).to.be.eql('application/pdf');
      });
  });

  it('/records (PATCH 附件字段--修改--image', () => {
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
                附件: [
                  {
                    token: 'space/2020/07/28/6fdc652231a8480398e302606ae28213',
                    mimeType: 'image/jpeg',
                    size: 7194,
                    name: '9d4911932181f254433a86b05797f9a6 (1).jpeg',
                    height: 478,
                    width: 479,
                  },
                ],
              },
            },
          ],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].fields.附件[0].token).to.be.eql(
          host + '/space/2020/07/28/6fdc652231a8480398e302606ae28213',
        );
        expect(result.data.records[0].fields.附件[0].preview).to.be.eql(undefined);
        expect(result.data.records[0].fields.附件[0].size).to.be.eql(7194);
        expect(result.data.records[0].fields.附件[0].height).to.be.eql(478);
        expect(result.data.records[0].fields.附件[0].width).to.be.eql(479);
        expect(result.data.records[0].fields.附件[0].name).to.be.eql('9d4911932181f254433a86b05797f9a6 (1).jpeg');
        expect(result.data.records[0].fields.附件[0].mimeType).to.be.eql('image/jpeg');
      });
  });

  it('/records (PATCH 附件字段--修改--null', () => {
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
                附件: null,
              },
            },
          ],
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
        expect(result.data.records[0].fields.附件).to.be.eql(undefined);
      });
  });

  it('/records (POST 附件字段--添加--record', async() => {
    const response = await app.inject({
      method: 'POST',
      url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
      payload: {
        records: [
          {
            fields: {
              附件: [
                {
                  token: 'space/2020/07/28/6fdc652231a8480398e302606ae28213',
                  mimeType: 'image/jpeg',
                  size: 7194,
                  name: '9d4911932181f254433a86b05797f9a6 (1).jpeg',
                  height: 478,
                  width: 479,
                },
              ],
            },
          },
          {
            fields: {
              附件: [
                {
                  token: 'space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
                  preview: 'space/2020/06/20/166113199f5848e7884207c4b54d521f',
                  size: 5008519,
                  height: 0,
                  width: 0,
                  name: '互联网传媒行业：2020微博动漫白皮书.pdf',
                  mimeType: 'application/pdf',
                },
              ],
            },
          },
        ],
      },
      headers: getDefaultHeader(app),
    });
    const result = response.json(response.payload);
    createSuccessExpect(response, result);
    // 收集添加的recordId用于删除
    insertRecordIds.push(result.data.records[0].recordId);
    insertRecordIds.push(result.data.records[1].recordId);
    // 第一条
    expect(result.data.records[0].fields.附件[0].token).to.be.eql(
      host + '/space/2020/07/28/6fdc652231a8480398e302606ae28213',
    );
    expect(result.data.records[0].fields.附件[0].preview).to.be.eql(undefined);
    expect(result.data.records[0].fields.附件[0].size).to.be.eql(7194);
    expect(result.data.records[0].fields.附件[0].height).to.be.eql(478);
    expect(result.data.records[0].fields.附件[0].width).to.be.eql(479);
    expect(result.data.records[0].fields.附件[0].name).to.be.eql('9d4911932181f254433a86b05797f9a6 (1).jpeg');
    expect(result.data.records[0].fields.附件[0].mimeType).to.be.eql('image/jpeg');
    // 第二条
    expect(result.data.records[1].fields.附件[0].token).to.be.eql(
      host + '/space/2020/06/20/38f89e81bb83496da5d8af6a0ba637ec',
    );
    expect(result.data.records[1].fields.附件[0].preview).to.be.eql(
      host + '/space/2020/06/20/166113199f5848e7884207c4b54d521f?imageView2/0/q/100',
    );
    expect(result.data.records[1].fields.附件[0].size).to.be.eql(5008519);
    expect(result.data.records[1].fields.附件[0].height).to.be.eql(0);
    expect(result.data.records[1].fields.附件[0].width).to.be.eql(0);
    expect(result.data.records[1].fields.附件[0].name).to.be.eql('互联网传媒行业：2020微博动漫白皮书.pdf');
    expect(result.data.records[1].fields.附件[0].mimeType).to.be.eql('application/pdf');
  });

  it('/records (POST 附件字段--删除--record', () => {
    return app
      .inject({
        method: 'DELETE',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/records',
        query: {
          recordIds: insertRecordIds,
        },
        headers: getDefaultHeader(app),
      })
      .then(response => {
        const result = response.json(response.payload);
        successExpect(response, result);
      });
  });

  it('/records (POST 上传附件--json', () => {
    const filePath = path.join(__dirname, '../test/jest-e2e.json');
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    return app
      .inject({
        method: 'POST',
        url: '/fusion/v1/datasheets/dstc0Po5LZSRKZpqpc/attachments',
        payload: form,
        headers: {
          ...getDefaultHeader(app),
          ...form.getHeaders(),
        },
      })
      .then(response => {
        const result = response.json(response.payload);
        createSuccessExpect(response, result);
        expect(result.data).to.have.own.property('token');
        expect(result.data).to.have.own.property('mimeType');
        expect(result.data).to.have.own.property('size');
        expect(result.data.name).to.be.eql('jest-e2e.json');
        expect(result.data.height).to.be.eql(0);
        expect(result.data.height).to.be.eql(0);
        expect(result.data.preview).to.be.eql(undefined);
      });
  });
});
