import { Module } from '@nestjs/common';
import { FormController } from './controllers/form.controller';
import { FormService } from './services/form.service';

@Module({
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
