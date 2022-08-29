import { Module } from '@nestjs/common';
import { FormServiceModule } from 'modules/services/form/form.service.module';
import { NodeServiceModule } from 'modules/services/node/node.service.module';
import { UserServiceModule } from 'modules/services/user/user.service.module';
import { FormController } from './form.controller';

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
