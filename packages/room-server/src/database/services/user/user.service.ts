import { Injectable } from '@nestjs/common';
import { EnvConfigKey } from '../../../shared/common';
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { IUserBaseInfo, INamedUser, IAuthHeader, IOssConfig } from '../../../shared/interfaces';
import { UnitInfo } from '../../interfaces';
import { UserRepository } from '../../repositories/user.repository';
import { getConnection } from 'typeorm';
import { RestService } from '../../../shared/services/rest/rest.service';

@Injectable()
export class UserService {
  constructor(
    private readonly envConfigService: EnvConfigService,
    private readonly restService: RestService,
    private readonly userRepo: UserRepository,
  ) { }

  /**
   * Get user info by UUIDs
   */
  async getUserInfo(spaceId: string, uuids: string[]): Promise<UnitInfo[]> {
    const queryRunner = getConnection().createQueryRunner();
    const users = await queryRunner.query(`
          SELECT vu.uuid userId, vu.uuid uuid, vui.id unitId, vui.is_deleted isDeleted, vui.unit_type type,
          IFNULL(vum.member_name,vu.nick_name) name, vu.avatar avatar, vum.is_active isActive,
          IFNULL(vu.is_social_name_modified, 2) > 0  AS isNickNameModified,
          IFNULL(vum.is_social_name_modified, 2) > 0 AS isMemberNameModified
          FROM vika_user vu
          LEFT JOIN vika_unit_member vum ON vum.user_id = vu.id AND vum.space_id = ?
          LEFT JOIN vika_unit vui ON vui.unit_ref_id = vum.id
          WHERE uuid IN (?)
        `,
    [spaceId, uuids],
    );
    await queryRunner.release();
    const oss = this.envConfigService.getRoomConfig(EnvConfigKey.OSS) as IOssConfig;
    return users.reduce((pre, cur) => {
      if (cur.avatar && !cur.avatar.startsWith('http')) {
        cur.avatar = oss.host + '/' + cur.avatar;
      }
      cur.isMemberNameModified = Number(cur.isMemberNameModified) === 1;
      cur.isNickNameModified = Number(cur.isNickNameModified) === 1;
      pre.push(cur);
      return pre;
    }, []);
  }

  /**
   * @author Zoe Zheng
   * @date 2020/7/24 3:18 PM
   */
  async getUserBaseInfoMapByUserIds(userIds: number[]): Promise<Map<string, INamedUser>> {
    const users = await this.userRepo.selectUserBaseInfoByIds(userIds);
    const userMap = new Map<string, INamedUser>();
    if (users) {
      users.forEach(user => {
        userMap.set(user.id, {
          id: Number(user.id),
          uuid: user.uuid || '',
          avatar: user.avatar || '',
          nikeName: user.nikeName || '',
          isSocialNameModified: user.isSocialNameModified
        });
      });
    }
    return userMap;
  }

  async session(cookie: string): Promise<boolean> {
    return await this.restService.hasLogin(cookie);
  }

  async getUserInfoBySpaceId(headers: IAuthHeader, spaceId: string) {
    return await this.restService.getUserInfoBySpaceId(headers, spaceId);
  }

  /**
   * Get self info
   */
  async getMe(headers: IAuthHeader): Promise<IUserBaseInfo> {
    return await this.restService.fetchMe(headers);
  }

  /**
   * Unlogged-in user view on share page
   * 
   * @param {string} cookie
   * @returns
   */
  async getMeNullable(cookie: string) {
    const hasLogin = await this.restService.hasLogin(cookie);
    if (hasLogin) {
      return await this.getMe({ cookie });
    }
    return {} as IUserBaseInfo;
  }
}
