import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DATASHEET_HTTP_DECORATE, USER_HTTP_DECORATE } from '../../common';
import { ApiException } from '../../exception';
import { UnitMemberRepository } from '../../../database/repositories/unit.member.repository';

/**
 * Guards are executed after each middleware, but before any interceptor or pipe.
 * datasheet info validate
 * the path start with:/fusion/v1/datasheets
 */
@Injectable()
export class ApiDatasheetGuard implements CanActivate {

  constructor( private readonly memberRepository: UnitMemberRepository) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // check if the datasheet exists
    if (!request.params || !request.params.datasheetId) {
      throw ApiException.tipError('api_datasheet_not_exist');
    }
    // works for datasheet related APIs
    const datasheet = request[DATASHEET_HTTP_DECORATE];
    if (!datasheet) {
      throw ApiException.tipError('api_datasheet_not_exist');
    }
    const spaceId = datasheet.spaceId;
    const user = request[USER_HTTP_DECORATE];
    const spaceIds = await this.memberRepository.selectSpaceIdsByUserId(user.id);
    // no permission of the space
    if (!spaceIds.length || !spaceIds.includes(spaceId)) {
      throw ApiException.tipError('api_datasheet_not_visible');
    }
    return true;
  }
}
