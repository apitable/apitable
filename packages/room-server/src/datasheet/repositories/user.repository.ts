import { UserEntity } from '../entities/user.entity';
import { EntityRepository, In, Repository } from 'typeorm';

/**
 * <p>
 * vika_developer数据库相关操作
 * </p>
 * @author Zoe zheng
 * @date 2020/7/24 3:15 下午
 */
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  /**
   * 根据userId查询用户信息
   * @param userId 用户ID
   * @return
   * @author Zoe Zheng
   * @date 2020/7/24 6:10 下午
   */
  selectUserBaseInfoById(userId: string): Promise<UserEntity | undefined> {
    return this.findOne({
      select: ['id', 'uuid', 'nikeName', 'avatar', 'locale'],
      where: [{ id: userId, isDeleted: false }],
    });
  }

  /**
   * 根据userId查询用户信息
   * @param userId 用户ID
   * @return
   * @author Zoe Zheng
   * @date 2020/7/24 6:10 下午
   */
  selectUserBaseInfoByIds(userIds: number[]): Promise<UserEntity[]> {
    return this.find({ select: ['id', 'uuid', 'avatar', 'nikeName', 'isSocialNameModified'], where: [{ id: In(userIds), isDeleted: false }] });
  }

  selectUserBaseInfoByIdsWithDeleted(userIds: string[]): Promise<UserEntity[]> {
    return this.find({ select: ['id', 'uuid', 'avatar', 'nikeName', 'isSocialNameModified'], where: [{ id: In(userIds) }] });
  }
}
