import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SPACE_ID_HTTP_DECORATE, USER_HTTP_DECORATE } from '../../common';
import { ApiException } from '../../exception';
import { UnitMemberRepository } from '../../../database/repositories/unit.member.repository';

/**
 * Guards are executed after each middleware, but before any interceptor or pipe.
 * space info validate guard
 * the path start with: /fusion/v1/spaces
 */
@Injectable()
export class ApiSpaceGuard implements CanActivate {

  constructor( private readonly memberRepository: UnitMemberRepository) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request[USER_HTTP_DECORATE];
    const spaceId = request[SPACE_ID_HTTP_DECORATE];
    const spaceIds = await this.memberRepository.selectSpaceIdsByUserId(user.id);
    // 不在空间无权操作
    if (!spaceIds.includes(spaceId)) {
      throw ApiException.tipError('api_forbidden_because_of_not_in_space');
    }
    return true;
  }
}
