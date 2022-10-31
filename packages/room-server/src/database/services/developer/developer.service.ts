import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../entities/user.entity';
import { DeveloperRepository } from '../../repositories/developer.repository';
import { UnitMemberRepository } from '../../repositories/unit.member.repository';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class DeveloperService {
  constructor(
    private readonly developerRepo: DeveloperRepository,
    private readonly userRepo: UserRepository,
    private readonly memberRepo: UnitMemberRepository,
  ) {}

  /**
   * Get User base info by api key
   * 
   * @param apiKey unique token on developer platform
   * @return user_id
   * @author Zoe Zheng
   * @date 2020/7/24 3:18 PM
   */
  public async getUserInfoByApiKey(apiKey: string): Promise<UserEntity> {
    const entity = await this.developerRepo.selectUserIdByApiKey(apiKey);
    if (entity && entity.userId) {
      return await this.userRepo.selectUserBaseInfoById(entity.userId.toString());
    }
    return null;
  }

  /**
   * Get space ID list of a user
   * 
   * @param userId user ID
   * @return  Promise<string[]>
   * @author Zoe Zheng
   * @date 2020/9/14 5:35 PM
   */
  public async getUserSpaceIds(userId: string): Promise<string[]> {
    return await this.memberRepo.selectSpaceIdsByUserId(userId);
  }
}
