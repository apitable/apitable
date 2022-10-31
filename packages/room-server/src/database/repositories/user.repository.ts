import { UserEntity } from '../entities/user.entity';
import { EntityRepository, In, Repository } from 'typeorm';

/**
 * Operations on table `vika_developer`
 * 
 * @author Zoe zheng
 * @date 2020/7/24 3:15 PM
 */
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  /**
   * Query user info by user ID
   * 
   * @author Zoe Zheng
   * @date 2020/7/24 6:10 PM
   */
  selectUserBaseInfoById(userId: string): Promise<UserEntity | undefined> {
    return this.findOne({
      select: ['id', 'uuid', 'nikeName', 'avatar', 'locale'],
      where: [{ id: userId, isDeleted: false }],
    });
  }

  /**
   * Query user info by user ID array
   * 
   * @author Zoe Zheng
   * @date 2020/7/24 6:10 PM
   */
  selectUserBaseInfoByIds(userIds: number[]): Promise<UserEntity[]> {
    return this.find({ select: ['id', 'uuid', 'avatar', 'nikeName', 'isSocialNameModified'], where: [{ id: In(userIds), isDeleted: false }] });
  }

  selectUserBaseInfoByIdsWithDeleted(userIds: string[]): Promise<UserEntity[]> {
    return this.find({ select: ['id', 'uuid', 'avatar', 'nikeName', 'isSocialNameModified'], where: [{ id: In(userIds) }] });
  }
}
