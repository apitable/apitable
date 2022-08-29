package com.vikadata.scheduler.space.service;

import com.vikadata.scheduler.space.handler.ClearOneWayLinkJobHandler;
import com.vikadata.scheduler.space.handler.FixDatasheetDataHandler;

/**
 * <p>
 * 工作台-数表元数据表 服务类
 * </p>
 *
 * @author Chambers
 * @date 2020/5/7
 */
public interface IDatasheetMetaService {

    /**
     * 更改meta
     *
     * @param nodeId 节点ID
     */
    void change(String nodeId);

    /**
     * 单向关联数据处理
     *
     * @param jobParam  定时任务参数
     * @return java.lang.String
     * @author Pengap
     * @date 2022/1/19 18:59:53
     */
    void oneWayLinkDataHandler(ClearOneWayLinkJobHandler.JobParam jobParam);

    /**
     * 修复「模版」视图排序字段
     *
     * @param jobParam  定时任务参数
     * @author Pengap
     * @date 2022/4/14 15:14:39
     */
    void fixTemplateViewSortInfo(FixDatasheetDataHandler.JobParam jobParam);

}
