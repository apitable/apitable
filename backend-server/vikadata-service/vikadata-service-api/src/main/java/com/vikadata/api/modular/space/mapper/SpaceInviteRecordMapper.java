package com.vikadata.api.modular.space.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.SpaceInviteRecordEntity;
import org.apache.ibatis.annotations.Param;

import java.util.Collection;
import java.util.List;

/**
 * <p>
 * 通讯录-邀请成员记录 Mapper 接口
 * </p>
 *
 * @author Shawn Deng
 * @since 2019-12-11
 */
public interface SpaceInviteRecordMapper extends BaseMapper<SpaceInviteRecordEntity> {

    /**
     * 空间内的指定邀请邮箱链接全部过期
     *
     * @param spaceIds 空间ID列表
     * @param email    邮件
     * @return 执行结果
     * @author Shawn Deng
     * @date 2019/12/13 18:05
     */
    int expireBySpaceIdAndEmail(@Param("spaceIds") List<String> spaceIds, @Param("email") String email);

    /**
     * 空间内的指定邀请邮箱链接全部过期
     *
     * @param spaceId 空间ID
     * @param emails  邮件列表
     * @return 执行结果
     * @author Shawn Deng
     * @date 2019/12/13 18:05
     */
    int expireBySpaceIdAndEmails(@Param("spaceId") String spaceId, @Param("emails") Collection<String> emails);

    /**
     * 根据InviteId查询
     *
     * @param inviteToken 邀请唯一令牌
     * @return inviteId
     * @author Shawn Deng
     * @date 2019/12/23 18:13
     */
    SpaceInviteRecordEntity selectByInviteToken(@Param("inviteToken") String inviteToken);


}
