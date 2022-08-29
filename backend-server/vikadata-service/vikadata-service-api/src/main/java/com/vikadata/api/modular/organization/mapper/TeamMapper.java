package com.vikadata.api.modular.organization.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.organization.TeamMemberDto;
import com.vikadata.api.model.vo.organization.MemberPageVo;
import com.vikadata.api.model.vo.organization.SearchTeamResultVo;
import com.vikadata.api.model.vo.organization.TeamInfoVo;
import com.vikadata.api.model.vo.organization.UnitTeamVo;
import com.vikadata.api.modular.organization.model.TeamBaseInfoDTO;
import com.vikadata.api.modular.organization.model.TeamCteInfo;
import com.vikadata.entity.TeamEntity;

/**
 * <p>
 * 组织架构-部门表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @since 2019-11-06
 */
public interface TeamMapper extends BaseMapper<TeamEntity> {

    /**
     * 查询空间内的根部门ID
     *
     * @param spaceId 空间ID
     * @return 根部门ID
     * @author Shawn Deng
     * @date 2020/1/10 15:23
     */
    Long selectRootIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询父ID
     *
     * @param teamId 小组ID
     * @return 父ID
     * @author Shawn Deng
     * @date 2020/12/18 18:19
     */
    Long selectParentIdByTeamId(@Param("teamId") Long teamId);

    /**
     * 根据部门名称模糊查询部门列表
     *
     * @param spaceId  空间ID
     * @param teamName 部分部门名称
     * @return 搜索结果
     * @author Shawn Deng
     * @date 2019/11/8 11:48
     */
    List<SearchTeamResultVo> selectByTeamName(@Param("spaceId") String spaceId, @Param("teamName") String teamName);

    /**
     * 查询是否有子部门
     *
     * @param parentId 父级ID
     * @return 数量
     * @author Shawn Deng
     * @date 2019/11/11 11:09
     */
    Integer existChildrenByParentId(@Param("parentId") Long parentId);

    /**
     * 根据部门ID查询子部门最大排序值
     *
     * @param parentId 父级ID
     * @return 数值
     * @author Shawn Deng
     * @ 2019/11/7 20:55
     */
    Integer selectMaxSequenceByParentId(@Param("parentId") Long parentId);

    /**
     * 查询根部门的子部门
     *
     * @param spaceId  空间ID
     * @param parentId 父级ID
     * @return TeamInfoVo 集合
     * @author Shawn Deng
     * @date 2019/11/6 17:26
     */
    List<TeamInfoVo> selectRootSubTeams(@Param("spaceId") String spaceId, @Param("parentId") Long parentId);

    /**
     * 根据部门ID查询部门信息
     *
     * @param spaceId  空间ID
     * @param teamIds   部门ID
     * @return TeamInfoVo 集合
     * @author liuzijing
     * @date 2022/5/23
     */
    List<TeamInfoVo> selectTeamInfoByTeamIds(@Param("spaceId") String spaceId, @Param("teamIds") List<Long> teamIds);

    /**
     * 根据父级ID查询子部门信息
     * 结果不包含本身部门信息
     *
     * @param spaceId  空间ID
     * @param parentId 父级ID
     * @return TeamInfoVo 集合
     * @author Shawn Deng
     * @date 2019/11/6 17:26
     */
    List<TeamInfoVo> selectSubTeamsByParentId(@Param("spaceId") String spaceId, @Param("parentId") Long parentId);

    /**
     * 查询部门下的直属子部门ID
     *
     * @param spaceId  空间ID
     * @param parentId 父级ID
     * @return 子部门ID集合
     * @author Shawn Deng
     * @date 2020/2/24 14:51
     */
    List<Long> selectTeamIdsByParentId(@Param("spaceId") String spaceId, @Param("parentId") Long parentId);

    /**
     * 查询所有父级部门ID
     *
     * @param teamId        部门ID
     * @param includeSelf   是否包含自己ID
     * @return 所有父级部门ID 集合
     * @author Chambers
     * @date 2021/4/21
     */
    List<Long> selectAllParentTeamIds(@Param("teamId") Long teamId, @Param("includeSelf") boolean includeSelf);

    /**
     * 查询部门下的所有子部门ID
     *
     * @param parentId    父级ID
     * @param includeSelf 是否包含自己ID
     * @return 所有子部门ID集合
     * @author Shawn Deng
     * @date 2019/11/7 21:23
     */
    List<Long> selectAllSubTeamIdsByParentId(@Param("parentId") Long parentId, @Param("includeSelf") boolean includeSelf);

    /**
     * 批量查询部门下的所有子部门ID
     *
     * @param parentIds 父级ID集合
     * @return 所有子部门ID集合
     * @author Shawn Deng
     * @date 2020/7/16 18:12
     */
    List<Long> selectAllSubTeamIds(@Param("parentIds") Collection<Long> parentIds);

    /**
     * 查询根部门下的所有成员
     *
     * @param spaceId 空间ID
     * @return 结果
     * @author Shawn Deng
     * @date 2019/11/16 10:51
     */
    List<MemberPageVo> selectMembersByRootTeamId(@Param("spaceId") String spaceId);

    /**
     * 分页查询根部门下的所有成员
     *
     * @param page    分页请求对象
     * @param spaceId 空间ID
     * @param isActive 过滤已加入或者未加入成员，不填则所有
     * @return 分页结果
     * @author Shawn Deng
     * @date 2019/11/16 10:51
     */
    IPage<MemberPageVo> selectMembersByRootTeamId(Page<MemberPageVo> page,
            @Param("spaceId") String spaceId, @Param("isActive") Integer isActive);

    /**
     * 查询指定部门的成员列表
     *
     * @param teamIds 部门ID
     * @return 结果
     * @author Shawn Deng
     * @date 2019/11/11 18:54
     */
    List<MemberPageVo> selectMembersByTeamId(@Param("teamIds") List<Long> teamIds);

    /**
     * 查询部门下所有部门的成员列表
     *
     * @param page    分页请求对象
     * @param teamIds 部门ID集合
     * @param isActive 过滤已加入或者未加入成员，不填则所有
     * @return 分页结果
     * @author Shawn Deng
     * @date 2019/11/11 18:54
     */
    IPage<MemberPageVo> selectMemberPageByTeamId(Page<MemberPageVo> page,
            @Param("teamIds") List<Long> teamIds, @Param("isActive") Integer isActive);

    /**
     * 查询空间下的所有部门
     *
     * @param spaceId 空间ID
     * @return 部门列表
     * @author Shawn Deng
     * @date 2019/11/27 14:24
     */
    List<TeamMemberDto> selectTeamsBySpaceId(@Param("spaceId") String spaceId, @Param("parentId") Long parentId);

    /**
     * 查询空间下成员所属的部门及其子部门
     *
     * @param spaceId 空间ID
     * @param teamIds  部门ID
     * @return 部门列表
     * @author liuzijing
     * @date 2022/5/17
     */
    List<TeamMemberDto> selectMemberTeamsBySpaceIdAndTeamIds(@Param("spaceId") String spaceId, @Param("teamIds") List<Long> teamIds);

    /**
     * 查询空间下指定名称的部门列表
     *
     * @param spaceId  空间ID
     * @param name     部门名称
     * @param parentId 父级ID
     * @return 部门列表
     * @author Shawn Deng
     * @date 2019/12/17 19:03
     */
    TeamEntity selectBySpaceIdAndName(@Param("spaceId") String spaceId, @Param("name") String name, @Param("parentId") Long parentId);

    /**
     * 获取部门信息
     *
     * @param teamIds 部门ID列表
     * @return 部门列表
     * @author Chamebers
     * @date 2020/2/20
     */
    List<TeamMemberDto> selectTeamsByIds(@Param("teamIds") List<Long> teamIds);

    /**
     * 批量查询部门
     *
     * @param teamIds 部门ID列表
     * @return TeamEntities
     * @author Chambers
     * @date 2022/6/6
     */
    List<TeamEntity> selectByTeamIdsIgnoreDelete(@Param("teamIds") Collection<Long> teamIds);

    /**
     * 查询空间的所有部门列表
     *
     * @param spaceId 空间ID
     * @return 部门列表
     * @author Shawn Deng
     * @date 2020/2/20 21:32
     */
    List<TeamEntity> selectAllBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 根据名称模糊搜索部门ID
     *
     * @param spaceId  空间ID
     * @param likeName 模糊词
     * @return 部门ID结果
     * @author Shawn Deng
     * @date 2020/2/24 11:47
     */
    List<Long> selectTeamIdsLikeName(@Param("spaceId") String spaceId, @Param("likeName") String likeName);

    /**
     * 根据部门名称查询ID
     *
     * @param spaceId   空间ID
     * @param teamNames 部门名称列表
     * @return ID 集合
     * @author Chambers
     * @date 2020/7/13
     */
    List<Long> selectIdBySpaceIdAndNames(@Param("spaceId") String spaceId, @Param("list") List<String> teamNames);

    /**
     * 根据部门ID查询视图
     *
     * @param spaceId 空间ID
     * @param teamId  部门ID
     * @return UnitTeamVo集合
     * @author Shawn Deng
     * @date 2020/2/24 12:16
     */
    UnitTeamVo selectUnitTeamVoByTeamId(@Param("spaceId") String spaceId, @Param("teamId") Long teamId);

    /**
     * 根据部门ID批量查询视图
     *
     * @param spaceId 空间ID
     * @param teamIds 部门ID集合
     * @return UnitTeamVo集合
     * @author Shawn Deng
     * @date 2020/2/24 12:16
     */
    List<UnitTeamVo> selectUnitTeamVoByTeamIds(@Param("spaceId") String spaceId, @Param("teamIds") List<Long> teamIds);

    /**
     * 根据部门ID查询空间ID
     *
     * @param teamId 部门ID
     * @return 空间ID
     * @author Chambers
     * @date 2020/3/23
     */
    String selectSpaceIdById(@Param("teamId") Long teamId);

    /**
     * 根据部门ID查询部门名称
     *
     * @param teamId 部门ID
     * @return Team Name
     * @author zoe zheng
     * @date 2020/5/29 2:25 下午
     */
    String selectTeamNameById(@Param("teamId") Long teamId);

    /**
     * 查询部门基础信息
     *
     * @param teamIds 部门ID集合
     * @return TeamBaseInfoDTO List
     * @author Shawn Deng
     * @date 2021/1/6 19:29
     */
    List<TeamBaseInfoDTO> selectBaseInfoDTOByIds(@Param("teamIds") Collection<Long> teamIds);

    /**
     * 查询部门下成员总数
     * @param teamId 部门ID
     * @return 总数
     * @author Shawn Deng
     * @date 2021/6/29 17:39
     */
    Integer selectMemberCountByTeamId(@Param("teamId") Long teamId);

    /**
     * 查询部门下已激活成员总数
     *
     * @param teamId 部门ID
     * @return 总数
     * @author 胡海平(Humphrey Hu)
     * @date 2021/12/30 10:27
     * */
    Integer selectActiveMemberCountByTeamId(@Param("teamId") Long teamId);

    /**
     * 获取空间的部门Id
     *
     * @param spaceId   空间站Id
     * @return 部门Id
     * @author Pengap
     * @date 2021/9/8 13:52:52
     */
    List<Long> selectTeamAllIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 根据名称查询所有父级部门
     * @param spaceId 空间ID
     * @param teamName 部门名称
     * @return 部门列表
     */
    List<TeamEntity> selectTreeByTeamName(@Param("spaceId") String spaceId, @Param("teamName") String teamName);

    /**
     * 根据部门ID列表递归查询所有部门
     * @param spaceId 空间ID
     * @param teamIds 部门ID
     * @return 部门ID
     */
    List<TeamCteInfo> selectChildTreeByTeamIds(@Param("spaceId") String spaceId, @Param("teamIds") List<Long> teamIds);

}
