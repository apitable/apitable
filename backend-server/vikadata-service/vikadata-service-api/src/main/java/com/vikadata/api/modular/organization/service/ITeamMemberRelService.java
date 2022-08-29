package com.vikadata.api.modular.organization.service;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.TeamMemberRelEntity;

/**
 * <p>
 * 组织架构-部门成员关联表 服务类
 * </p>
 *
 * @author Chambers
 * @since 2019-11-06
 */
public interface ITeamMemberRelService extends IService<TeamMemberRelEntity> {

    /**
     * 成员关联小组
     *
     * @param memberIds 成员ID
     * @param teamIds   小组ID集合
     * @author Shawn Deng
     * @date 2019/11/20 20:45
     */
    void addMemberTeams(List<Long> memberIds, List<Long> teamIds);

    /**
     * 快速批量插入
     *
     * @param entities 实体列表
     * @author Shawn Deng
     * @date 2019/11/20 20:45
     */
    void createBatch(List<TeamMemberRelEntity> entities);

    /**
     * 获取成员所属小组ID
     *
     * @param memberId 成员ID
     * @return 关联小组ID
     * @author Shawn Deng
     * @date 2020/12/19 00:02
     */
    List<Long> getTeamByMemberId(Long memberId);

    /**
     * 获取成员ID
     * @param teamId 部门ID
     * @return
     */
    List<Long> getMemberIdsByTeamId(Long teamId);

    /**
     * 从小组里移除指定成员
     *
     * @param memberId 成员ID
     * @author Shawn Deng
     * @date 2020/12/28 12:57
     */
    void removeByMemberId(Long memberId);

    /**
     * 批量从小组里移除指定成员
     * @param memberIds 成员id集合
     * @author Shawn Deng
     * @date 2021/8/4 14:58
     */
    void removeByMemberIds(List<Long> memberIds);

    /**
     * 根据根部门ID删除成员绑定
     *
     * @param rootTeamId 根部门ID
     * @author zoe zheng
     * @date 2021/7/5 11:28 上午
     */
    void removeByRootTeamId(Long rootTeamId);

    /**
     * 根据部门ID删除成员绑定
     * @param teamId 部门ID
     * @author Shawn Deng
     * @date 2021/8/9 14:49
     */
    void removeByTeamId(Long teamId);

    /**
     * 批量删除部门关联
     * @param teamIds 部门ID集合
     */
    void removeByTeamIds(Collection<Long> teamIds);
}
