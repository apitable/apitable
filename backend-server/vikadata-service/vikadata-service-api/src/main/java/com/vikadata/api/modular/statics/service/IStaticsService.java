package com.vikadata.api.modular.statics.service;

import java.util.List;

import com.vikadata.api.modular.statics.model.ControlStaticsVO;
import com.vikadata.api.modular.statics.model.DatasheetStaticsVO;
import com.vikadata.api.modular.statics.model.NodeStaticsVO;
import com.vikadata.api.modular.statics.model.NodeTypeStatics;

/**
 * <p>
 * 统计接口
 * </p>
 *
 * @author Chambers
 * @date 2021/6/18
 */
public interface IStaticsService {

    /**
     * 获取当月 API 使用量
     *
     * @param spaceId 空间ID
     * @return amount
     * @author Chambers
     * @date 2021/6/18
     */
    long getCurrentMonthApiUsage(String spaceId);

    /**
     * 获取今日API使用量，并更新缓存
     *
     * @param spaceId 空间ID
     * @return 数量
     * @author liuzijing
     * @date 2022/6/15
     */
    Long getTodayApiUsage(String spaceId);

    /**
     * 获取本月到昨天为止API使用量，并更新缓存
     *
     * @param spaceId 空间ID
     * @return 数量
     * @author liuzijing
     * @date 2022/6/15
     */
    Long getCurrentMonthApiUsageUntilYesterday(String spaceId);

    /**
     * 获取空间的总人数
     *
     * @param spaceId 空间ID
     * @return amount
     */
    long getMemberTotalCountBySpaceId(String spaceId);

    /**
     * 获取空间小组总数
     *
     * @param spaceId 空间ID
     * @return amount
     */
    long getTeamTotalCountBySpaceId(String spaceId);

    /**
     * 获取空间的子管理员总数
     *
     * @param spaceId 空间ID
     * @return amount
     */
    long getAdminTotalCountBySpaceId(String spaceId);

    /**
     * 获取空间所有数表的总行数
     *
     * @param spaceId 空间ID
     * @return amount
     */
    long getDatasheetRecordTotalCountBySpaceId(String spaceId);

    /**
     * 获取空间的附件总容量
     *
     * @param spaceId 空间ID
     * @return amount
     */
    long getTotalFileSizeBySpaceId(String spaceId);

    /**
     * 获取空间的权限统计视图
     *
     * @param spaceId 空间ID
     * @return ControlStaticsVO
     */
    ControlStaticsVO getFieldRoleTotalCountBySpaceId(String spaceId);

    /**
     * 获取空间的工作目录统计视图
     *
     * @param spaceId 空间ID
     * @return NodeStaticsVO
     */
    NodeStaticsVO getNodeStaticsBySpaceId(String spaceId);

    /**
     * 获取空间的节点类型统计视图
     *
     * @param spaceId 空间ID
     * @return NodeTypeStatics
     */
    List<NodeTypeStatics> getNodeTypeStaticsBySpaceId(String spaceId);

    /**
     * 获取空间的数表统计视图
     *
     * @param spaceId 空间ID
     * @return DatasheetStaticsVO
     */
    DatasheetStaticsVO getDatasheetStaticsBySpaceId(String spaceId);
}
