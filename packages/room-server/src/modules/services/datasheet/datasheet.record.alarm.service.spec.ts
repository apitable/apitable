import { INestApplication } from '@nestjs/common/interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DatasheetRecordAlarmService } from './datasheet.record.alarm.service';
import { AppModule } from 'app.module';
import dayjs from 'dayjs';

describe('datasheet record alarm service', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async() => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
  });

  afterAll(async() => {
    await app.close();
  });

  let alarmService: DatasheetRecordAlarmService;

  beforeEach(() => {
    alarmService = module.get(DatasheetRecordAlarmService);
  });

  describe('calculate record alarm at', () => {
    it('should returns origin input date value when alarmAtTime is invalid', () => {
      const nowTime = dayjs('2022-03-28T13:07:30Z');
      const alarmAtTime = 'xx:xx';
      const alarmAtSubtract = '';

      const alarmAt = alarmService.calculateAlarmAt(nowTime, alarmAtTime, alarmAtSubtract);
      expect(dayjs(alarmAt).diff(nowTime)).toEqual(0);
    });

    it('should returns origin input date value when alarmAtSubtract is invalid', () => {
      const nowTime = dayjs('2022-03-28T13:07:30Z');
      const alarmAtTime = '';
      const alarmAtSubtract = '5foo';

      const alarmAt = alarmService.calculateAlarmAt(nowTime, alarmAtTime, alarmAtSubtract);
      expect(dayjs(alarmAt).diff(nowTime)).toEqual(0);
    });

    it('should calculate alarm at with empty alarm at time and subtract', () => {
      const nowTime = dayjs('2022-03-28T13:07:30Z');
      const alarmAtTime = '';
      const alarmAtSubtract = '';

      const alarmAt = alarmService.calculateAlarmAt(nowTime, alarmAtTime, alarmAtSubtract);
      expect(dayjs(alarmAt).diff(nowTime)).toEqual(0);
    });

    // todo: set utc timezone for jest
    // it('should calculate alarm at with alarm at time but empty subtract', () => {
    //   const nowTime = dayjs('2022-03-28T13:30:00Z');
    //   const alarmAtTime = '12:00';
    //   const alarmAtSubtract = '';

    //   const alarmAt = alarmService.calculateAlarmAt(nowTime, alarmAtTime, alarmAtSubtract);
    //   expect(dayjs(alarmAt).diff(nowTime, 'minute')).toEqual(-90);
    // });

    it('should calculate alarm at with subtract but empty alarm at time', () => {
      const nowTime = dayjs('2022-03-28T13:30:00Z');
      const alarmAtTime = '';
      const alarmAtSubtract = '5m';

      const alarmAt = alarmService.calculateAlarmAt(nowTime, alarmAtTime, alarmAtSubtract);
      expect(dayjs(alarmAt).diff(nowTime, 'minute')).toEqual(-5);
    });

    // todo: set utc timezone for jest
    // it('should calculate alarm at with alarm at time and subtract', async() => {
    //   const nowTime = dayjs('2022-03-28T13:30:00Z');
    //   const alarmAtTime = '12:00';
    //   const alarmAtSubtract = '5m';

    //   const alarmAt = alarmService.calculateAlarmAt(nowTime, alarmAtTime, alarmAtSubtract);
    //   expect(dayjs(alarmAt).diff(nowTime, 'minute')).toEqual(-95);
    // });
  });

});
