// 这里放所有自定义装饰器
import { Inject, SetMetadata } from '@nestjs/common';
import { NODE_PERMISSION_REFLECTOR_KEY } from 'common/constants';
import { WINSTON_MODULE_PROVIDER } from 'modules/logger/winston.constants';

// 日志注入
export const InjectLogger = () => Inject(WINSTON_MODULE_PROVIDER);

export const NodePermissions = (...permissions: string[]) => SetMetadata(NODE_PERMISSION_REFLECTOR_KEY, permissions);

export class ExtraModel {}
