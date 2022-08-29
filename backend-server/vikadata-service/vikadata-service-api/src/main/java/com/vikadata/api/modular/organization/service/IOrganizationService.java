package com.vikadata.api.modular.organization.service;

import java.util.List;

import com.vikadata.api.model.vo.organization.SubUnitResultVo;
import com.vikadata.api.model.vo.organization.UnitInfoVo;
import com.vikadata.api.model.vo.organization.UnitMemberVo;
import com.vikadata.api.model.vo.organization.UnitSearchResultVo;
import com.vikadata.api.model.vo.organization.UnitTeamVo;
import com.vikadata.api.modular.organization.model.LoadSearchDTO;

/**
 * <p>
 * 组织单元 服务接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/1/10 14:19
 */
public interface IOrganizationService {

    /**
     * 搜索组织单元
     *
     * @param spaceId  空间ID
     * @param likeWord 搜索词
     * @param highlightClassName 高亮样式名称
     * @return UnitSearchResultVo
     * @author Shawn Deng
     * @date 2020/2/21 01:58
     */
    UnitSearchResultVo findLikeUnitName(String spaceId, String likeWord, String highlightClassName);

    /**
     * 查询部门下的组织单元资源
     *
     * @param spaceId 空间ID
     * @param teamId  部门ID
     * @return SubUnitResultVo视图
     * @author Shawn Deng
     * @date 2020/2/24 15:28
     */
    SubUnitResultVo findSubUnit(String spaceId, Long teamId);

    /**
     * 查询部门类型组织单元视图
     *
     * @param spaceId 空间ID
     * @param teamId  部门ID
     * @return UnitTeamVo
     * @author Shawn Deng
     * @date 2020/7/16 11:17
     */
    UnitTeamVo findUnitTeamVo(String spaceId, Long teamId);

    /**
     * 查询部门类型组织单元视图
     *
     * @param spaceId 空间ID
     * @param teamIds 部门ID列表
     * @return UnitTeamVo List
     * @author Shawn Deng
     * @date 2020/2/28 17:07
     */
    List<UnitTeamVo> findUnitTeamVo(String spaceId, List<Long> teamIds);

    UnitMemberVo finUnitMemberVo(Long memberId);

    /**
     * 查询成员类型组织单元视图
     *
     * @param memberIds 成员ID列表
     * @return UnitMemberVo List
     * @author Shawn Deng
     * @date 2020/2/28 17:07
     */
    List<UnitMemberVo> findUnitMemberVo(List<Long> memberIds);

    /**
     * 加载/搜索 组织单元信息视图
     *
     * @param userId    用户ID
     * @param spaceId   空间ID
     * @param params  搜索条件
     * @return UnitInfoVo
     * @author Chambers
     * @date 2020/5/27
     */
    List<UnitInfoVo> loadOrSearchInfo(Long userId, String spaceId, LoadSearchDTO params, Long sharer);

    /**
     * 精准查询组织单元名称
     *
     * @param spaceId 空间ID
     * @param names   名称
     * @return UnitInfoVo
     * @author Chambers
     * @date 2020/10/12
     */
    List<UnitInfoVo> accurateSearch(String spaceId, List<String> names);

    /**
     * 加载成员所属部门组织树首级部门
     *
     * @param spaceId 空间ID
     * @param teamIds 部门ID
     * @return SubUnitResultVo
     * @author liuzijing
     * @date 2022/5/12
     */
    SubUnitResultVo loadMemberFirstTeams(String spaceId, List<Long> teamIds);

    /**
     * 加载成员所属部门组织树首级部门ID
     *
     * @param spaceId 空间ID
     * @param teamIds 部门ID
     * @return teamIds 部门ID
     * @author liuzijing
     * @date 2022/5/12
     */
    List<Long> loadMemberFirstTeamIds(String spaceId, List<Long> teamIds);
}
