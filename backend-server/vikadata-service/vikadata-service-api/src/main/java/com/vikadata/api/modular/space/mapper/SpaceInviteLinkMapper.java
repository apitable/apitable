package com.vikadata.api.modular.space.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.space.SpaceLinkDto;
import com.vikadata.api.model.vo.space.SpaceLinkVo;
import com.vikadata.entity.SpaceInviteLinkEntity;

/**
 * <p>
 * 工作空间-公开邀请链接 Mapper 接口
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-03-17
 */
public interface SpaceInviteLinkMapper extends BaseMapper<SpaceInviteLinkEntity> {

    /**
     * 获取链接列表
     *
     * @param memberId 创建者成员ID
     * @return 链接列表
     * @author Chambers
     * @date 2020/3/23
     */
    List<SpaceLinkVo> selectLinkVo(@Param("memberId") Long memberId);

    /**
     * 通过部门ID、创建者ID获取表ID
     * 不区分逻辑删除
     *
     * @param teamId   部门ID
     * @param memberId 创建者成员ID
     * @return ID
     * @author Chambers
     * @date 2020/3/23
     */
    Long selectIdByTeamIdAndMemberId(@Param("teamId") Long teamId, @Param("memberId") Long memberId);

    /**
     * 通过ID修改token
     * updateById无法将逻辑删除去除
     *
     * @param token 邀请令牌编码
     * @param id    表ID
     * @return 修改数
     * @author Chambers
     * @date 2020/3/23
     */
    int updateInviteTokenById(@Param("token") String token, @Param("id") Long id);

    /**
     * 逻辑删除链接
     *
     * @param teamId    部门ID（非必须）
     * @param memberIds 创建者成员ID列表
     * @return 删除数
     * @author Chambers
     * @date 2020/3/23
     */
    int delByTeamIdAndMemberId(@Param("teamId") Long teamId, @Param("list") List<Long> memberIds);

    /**
     * 获取链接的空间、部门和创建者成员信息
     *
     * @param token 邀请令牌编码
     * @return dto
     * @author Chambers
     * @date 2020/3/23
     */
    SpaceLinkDto selectDtoByToken(@Param("token") String token);

    /**
     * 累加成功受邀人数
     *
     * @param token 邀请令牌编码
     * @return 修改数
     * @author Chambers
     * @date 2020/3/25
     */
    int updateInviteNumByInviteToken(@Param("token") String token);

    /**
     * 获取存在有效链接的成员ID列表
     *
     * @param spaceId 空间ID
     * @return 成员ID列表
     * @author Chambers
     * @date 2020/3/25
     */
    List<Long> selectCreatorBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 根据部门ID和创建者删除
     *
     * @param teamId   部门ID
     * @param creators 成员列表
     * @return 删除执行数量
     * @author Shawn Deng
     * @date 2020/4/8 11:10
     */
    int updateByTeamIdAndCreators(@Param("teamId") Long teamId, @Param("creators") List<Long> creators);

    /**
     * 根据部门ID和创建者删除
     *
     * @param teamIds 部门ID列表
     * @param creator 成员ID
     * @return 删除执行数量
     * @author Shawn Deng
     * @date 2020/4/8 11:10
     */
    int updateByTeamIdsAndCreator(@Param("teamIds") List<Long> teamIds, @Param("creator") Long creator);

    /**
     * 根据创建者删除
     *
     * @param creators 成员列表
     * @return 删除执行数量
     * @author Shawn Deng
     * @date 2020/4/8 11:10
     */
    int updateByCreators(@Param("creators") List<Long> creators);

    /**
     * 根据部门删除邀请链接
     *
     * @param teamId 部门ID
     * @return 删除执行数量
     * @author Shawn Deng
     * @date 2020/4/8 11:10
     */
    @Deprecated
    int updateByTeamId(@Param("teamId") Long teamId);

    /**
     * 批量根据部门删除邀请链接
     *
     * @param teamIds 部门ID
     * @return 删除执行数量
     * @author Shawn Deng
     * @date 2020/4/8 11:10
     */
    @Deprecated
    int updateBatchByTeamId(@Param("teamIds") Collection<Long> teamIds);

    /**
     * 查询部门ID的行ID
     * @param teamIds 部门ID
     * @return 行ID列表
     */
    Long selectIdByTeamId(@Param("teamId") Long teamIds);

    /**
     * 查询部门ID的行ID
     * @param teamIds 部门ID
     * @return 行ID列表
     */
    List<Long> selectIdByTeamIds(@Param("teamIds") Collection<Long> teamIds);
}
