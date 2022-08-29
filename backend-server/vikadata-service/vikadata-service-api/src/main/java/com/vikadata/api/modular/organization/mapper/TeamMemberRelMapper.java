package com.vikadata.api.modular.organization.mapper;

import java.util.Collection;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.api.modular.mapper.ExpandBaseMapper;
import com.vikadata.entity.TeamMemberRelEntity;

/**
 * <p>
 * 组织架构-部门成员关联表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @since 2019-11-06
 */
public interface TeamMemberRelMapper extends ExpandBaseMapper<TeamMemberRelEntity> {

    /**
     * 自定义快速批量插入
     *
     * @param entities 实体类列表
     * @return 执行结果
     * @author Shawn Deng
     * @date 2019/12/18 20:12
     */
    int insertBatch(@Param("entities") List<TeamMemberRelEntity> entities);

    /**
     * 查询会员的所属部门ID列表
     * 排除根部门关联
     *
     * @param memberId 成员ID
     * @return 部门列表
     * @author Shawn Deng
     * @date 2019/11/18 18:04
     */
    List<Long> selectTeamIdsByMemberId(@Param("memberId") Long memberId);

    /**
     * 查询所有部门关联成员数量
     *
     * @param teamIds 部门ID集合
     * @return 总数
     * @author Shawn Deng
     * @date 2019/11/7 21:14
     */
    Integer countByTeamId(@Param("teamIds") List<Long> teamIds);

    /**
     * 删除部门的关联成员
     *
     * @param teamId 部门ID
     * @return 结果数
     * @author Shawn Deng
     * @date 2019/11/16 11:43
     */
    int deleteByTeamId(@Param("teamId") Long teamId);

    /**
     * 删除成员所有关联部门
     *
     * @param memberIds 成员ID集合
     * @return 结果
     * @author Shawn Deng
     * @date 2019/11/18 18:40
     */
    int deleteByMemberId(@Param("memberIds") List<Long> memberIds);

    /**
     * 删除指定成员的关联的部门
     *
     * @param memberId 成员ID
     * @param teamIds  部门ID集合
     * @return 结果
     * @author Shawn Deng
     * @date 2019/11/20 20:43
     */
    int deleteByTeamIdsAndMemberId(@Param("memberId") Long memberId, @Param("teamIds") List<Long> teamIds);

    /**
     * 批量删除指定成员的关联的部门
     *
     * @param memberIds 成员ID集合，非空
     * @param teamId    部门ID，非空
     * @return 结果
     * @author Shawn Deng
     * @date 2019/11/20 20:43
     */
    int deleteBatchMemberByTeams(@Param("memberIds") List<Long> memberIds, @Param("teamId") Long teamId);

    /**
     * 查询成员所属部门的总数
     *
     * @param memberIds 成员ID集合，非空
     * @param teamId    部门ID，非空
     * @return 总数
     * @author Shawn Deng
     * @date 2019/12/19 11:59
     */
    Integer selectCountByMemberIdsAndTeamId(@Param("memberIds") List<Long> memberIds, @Param("teamId") Long teamId);

    /**
     * 根据成员ID列表批量查询
     *
     * @param memberIds 成员ID集合，非空
     * @return 集合
     * @author Shawn Deng
     * @date 2019/12/19 11:59
     */
    List<TeamMemberRelEntity> selectByMemberIds(@Param("memberIds") List<Long> memberIds);

    /**
     * 批量部门ID列表批量查询
     *
     * @param teamIds 部门集合
     * @return TeamMemberRelEntity List
     * @author Shawn Deng
     * @date 2019/12/23 12:16
     */
    List<TeamMemberRelEntity> selectByTeamIds(@Param("teamIds") List<Long> teamIds);

    /**
     * 查询部门下的成员
     *
     * @param teamId 部门ID
     * @return 成员ID集合
     * @author Shawn Deng
     * @date 2020/2/22 23:25
     */
    List<Long> selectMemberIdsByTeamId(@Param("teamId") Long teamId);

    /**
     * 批量查询部门下的成员
     *
     * @param teamIds 部门ID集合
     * @return 成员ID集合
     * @author Shawn Deng
     * @date 2020/2/22 23:25
     */
    List<Long> selectMemberIdsByTeamIds(@Param("teamIds") Collection<Long> teamIds);

    /**
     * 批量查询部门下已激活的成员
     *
     * @param teamIds 部门ID集合
     * @return 成员ID集合
     * @author 胡海平(Humphrey Hu)
     * @date 2021/12/29 14:49
     * */
    List<Long> selectActiveMemberIdsByTeamIds(@Param("teamIds") Collection<Long> teamIds);

    /**
     * 根据部门ID和成员ID查询
     *
     * @param teamId    部门ID
     * @param memberIds 成员ID集合
     * @return ID集合
     * @author Shawn Deng
     * @date 2020/4/8 19:22
     */
    List<Long> selectTeamIdAndMemberIds(@Param("teamId") Long teamId, @Param("memberIds") List<Long> memberIds);

    /**
     * 查询根部门下的成员
     *
     * @param rootTeamId 根部门ID
     * @return 成员ID集合
     * @author Shawn Deng
     * @date 2020/2/22 23:25
     */
    List<Long> selectMemberIdsByRootTeamId(@Param("rootTeamId") Long rootTeamId);

    /**
     * 查询会员的所属部门ID列表
     * 结果包含所有上级部门，一直查到根节点
     *
     * @param memberId 成员ID
     * @return 部门列表
     * @author Shawn Deng
     * @date 2019/11/18 18:04
     */
    List<Long> selectAllTeamIdByMemberId(@Param("memberId") Long memberId);

    /**
     * 批量根据部门ID删除
     * @param teamIds 部门ID列表
     * @return 执行行数
     */
    int deleteByTeamIds(@Param("teamIds") Collection<Long> teamIds);
}
