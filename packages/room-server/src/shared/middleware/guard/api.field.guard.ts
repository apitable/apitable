import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DATASHEET_HTTP_DECORATE, USER_HTTP_DECORATE } from '../../common';
import { ApiException } from '../../exception';
import { UnitMemberRepository } from '../../../database/repositories/unit.member.repository';
import { ApiTipConstant } from '@apitable/core';

/**
 * Guards are executed after each middleware, but before any interceptor or pipe.
 * datasheet info validate
 * the path start with:/fusion/v1/datasheets
 */
@Injectable()
export class ApiFieldGuard implements CanActivate {

  constructor( private readonly memberRepository: UnitMemberRepository) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // check if the datasheet exists
    if (!request.params || !request.params.datasheetId) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }
    const spaceId = request.params.spaceId;
    if(!spaceId) {
      throw ApiException.tipError(ApiTipConstant.api_params_instance_space_id_error);
    }
    // works for datasheet related APIs
    const datasheet = request[DATASHEET_HTTP_DECORATE];
    if (!datasheet) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }
    const user = request[USER_HTTP_DECORATE];
    const spaceIds = await this.memberRepository.selectSpaceIdsByUserId(user.id);
    // no permission of the space
    if (!spaceIds.includes(spaceId)) {
      throw ApiException.tipError(ApiTipConstant.api_forbidden_because_of_not_in_space);
    }
    // datasheet is not in the space
    if (datasheet.spaceId !== spaceId) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_visible);
    }
    return true;
  }
}
