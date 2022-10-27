import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import {
  generateRandomString, getNewIds, IDPrefix,
  IListDeleteAction, IListInsertAction, ILocalChangeset, IObjectDeleteAction, IObjectInsertAction, ResourceType
} from '@apitable/core';
import { AppModule } from 'app.module';
import { OtService } from 'datasheet/services/ot/ot.service';
import { IRoomChannelMessage } from './ot.interface';

describe('OtService', () => {
  let app;
  let otService: OtService;

  beforeAll(async() => {
    jest.setTimeout(60000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    otService = app.get(OtService);
  });

  afterAll(async() => {
    await app.close();
  });

  const spaceId = 'spczdmQDfBAn5';
  const dstId = 'dstsejCJ4l2Rvora4d';

  // tests keep failing, TODO: fix
  xdescribe('parseChanges', () => {
    it('add and del same record', async() => {
      const recordId = getNewIds(IDPrefix.Record, 1, [])[0];
      const cs: ILocalChangeset = {
        messageId: generateRandomString(),
        baseRevision: 0,
        resourceId: dstId,
        resourceType: ResourceType.Datasheet,
        operations: [
          {
            cmd: 'AddRecords',
            actions: [
              { n: 'LI', p: ['meta', 'views', 0, 'rows', 1], li: { recordId }} as IListInsertAction,
              { n: 'OI', p: ['recordMap', recordId], oi: { id: recordId, data: {}, commentCount: 0 }} as IObjectInsertAction
            ]
          },
          {
            cmd: 'DeleteRecords',
            actions: [
              { n: 'LD', p: ['meta', 'views', 0, 'rows', 1], ld: { recordId }} as IListDeleteAction,
              { n: 'OD', p: ['recordMap', recordId], od: { id: recordId, data: {}, commentCount: 0 }} as IObjectDeleteAction
            ]
          }
        ]
      };
      const message: IRoomChannelMessage = { roomId: dstId, changesets: [cs], internalAuth: { userId: '', uuid: '' }};
      const { resultSet } = await otService.parseChanges(spaceId, message, cs, {});
      expect(resultSet.toCreateRecord.has(recordId)).toEqual(false);
    });

    it('del record and undo', async() => {
      const recordId = 'recEGVXZkR3ri';
      const cs: ILocalChangeset = {
        messageId: generateRandomString(),
        baseRevision: 0,
        resourceId: dstId,
        resourceType: ResourceType.Datasheet,
        operations: [
          {
            cmd: '"DeleteRecords"',
            actions: [
              { n: 'LD', p: ['meta', 'views', 0, 'rows', 1], ld: { recordId }} as IListDeleteAction,
              { n: 'OD', p: ['recordMap', recordId], od: { id: recordId, data: {}, commentCount: 0 }} as IObjectDeleteAction
            ]
          },
          {
            cmd: 'UNDO:"DeleteRecords"',
            actions: [
              { n: 'LI', p: ['meta', 'views', 0, 'rows', 1], li: { recordId }} as IListInsertAction,
              { n: 'OI', p: ['recordMap', recordId], oi: { id: recordId, data: {}, commentCount: 0 }} as IObjectInsertAction
            ]
          }
        ]
      };
      const message: IRoomChannelMessage = { roomId: dstId, changesets: [cs], internalAuth: { userId: '', uuid: '' }};
      const { resultSet } = await otService.parseChanges(spaceId, message, cs, {});
      expect(resultSet.toDeleteRecordIds.includes(recordId)).toEqual(false);
    });
  });
});
