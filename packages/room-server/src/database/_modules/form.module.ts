import { Module } from '@nestjs/common';
import { FormServiceModule } from './form.service.module';
import { NodeServiceModule } from './node.service.module';
import { UserServiceModule } from './user.service.module';
import { FormController } from '../controllers/form.controller';

@Module({
  imports: [
  UserServiceModule, 
  NodeServiceModule, 
  FormServiceModule,
  ],
  controllers: [FormController],
  })
// todo 和service层的FormModule重名了，这里的NodeRepository可以迁移到service层去做
export class FormModule {}
