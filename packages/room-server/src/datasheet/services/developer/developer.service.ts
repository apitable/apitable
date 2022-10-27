import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../entities/user.entity';
import { DeveloperRepository } from '../../repositories/developer.repository';
import { UnitMemberRepository } from '../../repositories/unit.member.repository';
import { UserRepository } from '../../repositories/user.repository';

/**
 * 开发者服务
 */
@Injectable()
export class DeveloperService {
  constructor(
    private readonly developerRepo: DeveloperRepository,
    private readonly userRepo: UserRepository,
    private readonly memberRepo: UnitMemberRepository,
  ) {}

  /**
   * 根据apiKay查找userId
   * @param apiKey 开发者平台唯一令牌
   * @return user_id
   * @author Zoe Zheng
   * @date 2020/7/24 3:18 下午
   */
  public async getUserInfoByApiKey(apiKey: string): Promise<UserEntity> {
    const entity = await this.developerRepo.selectUserIdByApiKey(apiKey);
    if (entity && entity.userId) {
      return await this.userRepo.selectUserBaseInfoById(entity.userId.toString());
    }
    return null;
  }

  /**
   * 获取用户的spaceId集合
   * @param userId 用户ID
   * @return  Promise<string[]>
   * @author Zoe Zheng
   * @date 2020/9/14 5:35 下午
   */
  public async getUserSpaceIds(userId: string): Promise<string[]> {
    return await this.memberRepo.selectSpaceIdsByUserId(userId);
  }
}
