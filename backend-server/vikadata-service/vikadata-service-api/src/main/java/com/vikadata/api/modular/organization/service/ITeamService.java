package com.vikadata.api.modular.organization.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.model.vo.organization.TeamInfoVo;
import com.vikadata.api.model.vo.organization.TeamTreeVo;
import com.vikadata.api.model.vo.organization.UnitTeamVo;
import com.vikadata.api.modular.organization.model.MemberIsolatedInfo;
import com.vikadata.entity.TeamEntity;

/**
 * <p>
 * 组织架构-部门表 服务类
 * </p>
 *
 * @author Chambers
 * @since 2019-11-06
 */
public interface ITeamService extends IService<TeamEntity> {

    /**
     * 查询成员所属部门ID集合，包括所有父级部门
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @return ID集合
     * @author Shawn Deng
     * @date 2020/2/20 21:48
     */
    Set<Long> getTeamIdsByMemberId(String spaceId, Long memberId);

    /**
     * 检查部门以下是否存在成员或部门
     *
     * @param spaceId 空间ID
     * @param teamId  部门ID
     * @return true | false
     * @author Shawn Deng
     * @date 2020/2/28 18:16
     */
    boolean checkHasSubUnitByTeamId(String spaceId, Long teamId);

    /**
     * 检查成员是否被通讯录隔离
     *
     * @param spaceId 空间ID
     * @param memberId 成员ID
     * @return MemberIsolatedInfo 成员隔离信息
     * @author liuzijing
     * @date 2022/5/17
     */
    MemberIsolatedInfo checkMemberIsolatedBySpaceId(String spaceId, Long memberId);

    /**
     * 统计部门以下所有成员数量
     *
     * @param teamId 部门ID
     * @return 总数
     * @author Shawn Deng
     * @date 2020/2/28 18:13
     */
    int countMemberCountByParentId(Long teamId);

    /**
     * 获取指定部门列表的成员总数
     *
     * @param teamIds 部门ID集合
     * @return 成员总数
     * @author Shawn Deng
     * @date 2020/2/22 22:49
     */
    int getMemberCount(List<Long> teamIds);

    /**
     * 查询指定部门下的所有关联成员ID
     *
     * @param teamIds 部门ID集合
     * @return 成员ID列表
     * @author Shawn Deng
     * @date 2020/7/16 18:15
     */
    List<Long> getMemberIdsByTeamIds(List<Long> teamIds);

    /**
     * 获取根部门ID
     *
     * @param spaceId 空间ID
     * @return 根部门ID
     * @author Shawn Deng
     * @date 2020/12/18 17:41
     */
    Long getRootTeamId(String spaceId);

    /**
     * 获取根部门组织单元ID
     * @param spaceId 空间ID
     * @return 根部门组织单元ID
     * @author Shawn Deng
     * @date 2021/4/6 18:24
     */
    Long getRootTeamUnitId(String spaceId);

    /**
     * 获取部门及所有父级部门的组织单元
     *
     * @param teamId 小组ID
     * @return 组织单元ID 集合
     * @author Chambers
     * @date 2021/4/21
     */
    List<Long> getUnitsByTeam(Long teamId);

    /**
     * 获取父小组ID
     *
     * @param teamId 小组ID
     * @return 父ID
     * @author Shawn Deng
     * @date 2020/12/18 18:20
     */
    Long getParentId(Long teamId);

    /**
     * 获取所有子小组ID，不包含自己
     * @param teamId 小组ID
     * @return 子小组ID
     */
    List<Long> getAllSubTeamIdsByParentId(Long teamId);

    /**
     * 获取部门下子部门最大排序值
     *
     * @param parentId 父小组ID
     * @return 子部门最大排序值
     * @author Shawn Deng
     * @date 2020/12/22 00:07
     */
    int getMaxSequenceByParentId(Long parentId);

    /**
     * 创建根部门，根部门与空间名称同步
     *
     * @param spaceId   空间ID
     * @param spaceName 空间名称
     * @return 部门ID
     * @author Shawn Deng
     * @date 2020/1/10 14:50
     */
    Long createRootTeam(String spaceId, String spaceName);

    /**
     * 批量添加部门
     *
     * @param spaceId  空间ID
     * @param entities 部门实体列表
     * @author Shawn Deng
     * @date 2019/11/7 15:32
     */
    void batchCreateTeam(String spaceId, List<TeamEntity> entities);

    /**
     * 添加子部门
     *
     * @param spaceId 空间ID
     * @param name    部门名称
     * @param superId 上级部门ID
     * @return 部门ID
     * @author Shawn Deng
     * @date 2019/11/7 15:32
     */
    Long createSubTeam(String spaceId, String name, Long superId);

    /**
     * 根据名称批量插入部门
     * 专为上传数据处理，其他接口无特殊情况别调用
     *
     * @param spaceId      空间ID
     * @param rootTeamId 根部门ID
     * @param teamNames 部门名称列表(示例：[一级-,二级,三级])
     * @return 部门ID列表
     * @author Shawn Deng
     * @date 2019/12/18 20:19
     */
    List<Long> createBatchByTeamName(String spaceId, Long rootTeamId, List<String> teamNames);

    /**
     * 根据部门路径获取最底的部门ID
     * @param spaceId 空间ID
     * @param teamNames 部门路径集合，例如 [A,B,C]
     * @return
     */
    Long getByTeamNamePath(String spaceId, List<String> teamNames);

    /**
     * 根据部门ID查询部门信息
     * 根部门默认为0
     *
     * @param spaceId 空间ID
     * @param teamId  部门ID
     * @return TeamInfoVo 部门信息
     * @author Shawn Deng
     * @date 2019/11/6 16:11
     */
    TeamInfoVo getTeamInfoById(String spaceId, Long teamId);

    /**
     * 修改部门名称
     *
     * @param teamId   部门ID
     * @param teamName 部门名称
     * @author Shawn Deng
     * @date 2020/1/11 00:22
     */
    void updateTeamName(Long teamId, String teamName);

    /**
     * 调整部门层级
     *
     * @param teamId   部门ID
     * @param teamName 部门名称
     * @param parentId 父级部门ID
     * @author Shawn Deng
     * @date 2020/1/11 00:22
     */
    void updateTeamParent(Long teamId, String teamName, Long parentId);

    /**
     * 删除部门
     * 只删除单个部门，不能删除子部门
     *
     * @param teamId 部门ID
     * @author Shawn Deng
     * @date 2019/11/7 20:57
     */
    void deleteTeam(Long teamId);

    /**
     * 批量删除单个部门
     * @param teamIds 部门ID
     */
    void deleteTeam(Collection<Long> teamIds);

    /**
     * 删除下面所有子部门
     *
     * @param spaceId 空间id
     * @param teamId  部门ID
     * @author Shawn Deng
     * @date 2019/11/7 20:57
     */
    void deleteSubTeam(String spaceId, Long teamId);

    /**
     * 统计空间下每个部门的人数，包含所有子部门的人数
     *
     * @param spaceId 空间id
     * @return 子节点列表
     * @author Chamebers
     * @date 2020/2/20
     */
    List<TeamTreeVo> build(String spaceId, Long id);

    /**
     * 获取成员所属部门及其子部门VO
     *
     * @param spaceId 空间id
     * @param teamIds  部门id
     * @return 子节点列表
     * @author liuzijing
     * @date 2022/5/17
     */
    List<TeamTreeVo> buildTree(String spaceId, List<Long> teamIds);

    /**
     * 统计部门节点下每个部门的人数，包含所有子部门的人数
     *
     * @param teamId 部门id
     * @return 部门id-人数MAP
     * @author Chamebers
     * @date 2020/2/20
     */
    Map<Long, Integer> getTeamMemberCountMap(Long teamId);

    /**
     * 获取空间的部门Id
     *
     * @param spaceId   空间站Id
     * @return 部门Id
     * @author Pengap
     * @date 2021/9/8 13:48:39
     */
    List<Long> getTeamIdsBySpaceId(String spaceId);

    /**
     * 获取部门组织树
     *
     * @param spaceId   空间站Id
     * @param teamIds   部门ID
     * @return 部门树
     * @author liuzijing
     * @date 2022/5/11
     */
    List<TeamTreeVo> getMemberTeamTree(String spaceId, List<Long> teamIds);

    /**
     * 获取成员所属部门及所属部门子部门VO
     *
     * @param spaceId   空间站Id
     * @param teamIds   部门Id
     * @return 部门VO
     * @author liuzijing
     * @date 2022/5/15
     */
    List<TeamTreeVo> getMemberAllTeamsVO(String spaceId, List<Long> teamIds);

    /**
     * 加载成员部门组织树
     *
     * @param spaceId   空间站Id
     * @param memberId  成员Id
     * @return 部门组织树
     * @author liuzijing
     * @date 2022/5/17
     */
    List<TeamTreeVo> loadMemberTeamTree(String spaceId, Long memberId);


    /**
     * batch query team's unitId、teamId、teamName by team's ids.
     *
     * @param spaceId   space id
     * @param teamIds   team ids
     * @return UnitTeamVo
     */
    List<UnitTeamVo> getUnitTeamVo(String spaceId, List<Long> teamIds);

}
