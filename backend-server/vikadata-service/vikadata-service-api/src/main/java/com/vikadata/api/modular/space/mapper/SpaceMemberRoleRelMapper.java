package com.vikadata.api.modular.space.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.SpaceMemberRoleRelEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 工作空间-角色权限关联表 Mapper 接口
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-07
 */
public interface SpaceMemberRoleRelMapper extends BaseMapper<SpaceMemberRoleRelEntity> {

    /**
     * 查询空间的子管理员列表
     *
     * @param spaceId 空间ID
     * @return 管理员成员ID
     * @author Shawn Deng
     * @date 2020/5/15 11:49
     */
    List<Long> selectSubAdminBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询空间的子管理员角色
     *
     * @param spaceId 空间ID
     * @return 管理员成员ID
     * @author Shawn Deng
     * @date 2020/5/15 11:49
     */
    List<String> selectRoleCodesBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 根据成员ID查询空间子管理
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @return 总数
     * @author Shawn Deng
     * @date 2020/2/14 00:31
     */
    Integer selectCountBySpaceIdAndMemberId(@Param("spaceId") String spaceId, @Param("memberId") Long memberId);

    /**
     * 根据成员ID批量查询空间子管理
     *
     * @param spaceId   空间ID
     * @param memberIds 成员ID列表
     * @return 总数
     * @author Shawn Deng
     * @date 2020/2/14 00:31
     */
    Integer selectCountBySpaceIdAndMemberIds(@Param("spaceId") String spaceId, @Param("memberIds") List<Long> memberIds);

    /**
     * 获取角色编码
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @return 查询角色编码
     * @author Shawn Deng
     * @date 2020/2/16 14:56
     */
    String selectRoleCodeByMemberId(@Param("spaceId") String spaceId, @Param("memberId") Long memberId);

    /**
     * 删除成员对应角色
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @return 删除结果数
     * @author Shawn Deng
     * @date 2020/2/16 15:30
     */
    int deleteBySpaceIdAndMemberId(@Param("spaceId") String spaceId, @Param("memberId") Long memberId);

    /**
     * 根据空间ID和角色编码，查询存在的角色编码
     *
     * @param spaceId   空间ID
     * @param roleCodes 资源编码
     * @return 角色编码集合
     * @author Chambers
     * @date 2022/2/14
     */
    List<String> selectRoleCodesBySpaceIdAndRoleCodes(@Param("spaceId") String spaceId, @Param("roleCodes") List<String> roleCodes);

    /**
     * 根据spaceId和角色编码查询成员ID
     *
     * @param spaceId   空间ID
     * @param roleCodes 资源编码
     * @return 成员ID集合
     * @author zoe zheng
     * @date 2020/5/26 11:16 上午
     */
    List<Long> selectMemberIdBySpaceIdAndRoleCodes(@Param("spaceId") String spaceId, @Param("roleCodes") List<String> roleCodes);

    /**
     * 真实批量添加
     *
     * @param entities 实体类集合
     * @return 成功添加数量
     * @author Shawn Deng
     * @date 2020/1/14 13:00
     */
    int insertBatch(@Param("entities") List<SpaceMemberRoleRelEntity> entities);

    /**
     * 批量获取角色编码
     *
     * @param spaceId   空间ID
     * @param memberIds 成员ID列表
     * @return 查询角色编码
     * @author Shawn Deng
     * @date 2020/2/16 14:56
     */
    List<String> selectRoleCodeByMemberIds(@Param("spaceId") String spaceId, @Param("memberIds") List<Long> memberIds);

    /**
     * 批量根据成员ID删除
     *
     * @param memberIds 成员ID列表
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/6/20 10:53
     */
    int batchDeleteByMemberIds(@Param("memberIds") List<Long> memberIds);

    /**
     * 删除空间的所有子管理员
     *
     * @param spaceId 空间ID
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/12/18 12:35
     */
    int deleteBySpaceId(@Param("spaceId") String spaceId);
}
