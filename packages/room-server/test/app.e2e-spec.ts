import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { expect } from 'chai';
import { AppModule } from 'app.module';

describe('HealthController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
  });

  it('/ (GET)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/actuator/health',
      })
      .then(response => {
        expect(response.statusCode).to.be.eql(200);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
