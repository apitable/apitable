package com.vikadata.api.modular.workspace.service;

import java.util.List;

import com.vikadata.api.model.ro.widget.WidgetAuditSubmitDataRo;
import com.vikadata.api.model.ro.widget.WidgetAuditGlobalIdRo;
import com.vikadata.api.model.ro.widget.WidgetStoreListRo;
import com.vikadata.api.model.vo.widget.WidgetStoreListInfo;

/**
 * <p>
 * 小程序申请 服务接口
 * </p>
 * @author Pengap
 * @date 2022/3/8 15:59:56
 */
public interface IWidgetAuditService {

    /**
     * 发行全局ID
     *
     * @param opUserId       操作用户
     * @param body  请求参数
     * @return boolean
     * @author Pengap
     * @date 2022/3/7 22:43:51
     */
    String issuedGlobalId(Long opUserId, WidgetAuditGlobalIdRo body);

    /**
     * 查询待审核小程序列表
     *
     * @param body  请求参数
     * @return 待审核列表
     * @author Pengap
     * @date 2022/3/9 02:35:51
     */
    List<WidgetStoreListInfo> waitReviewWidgetList(WidgetStoreListRo body);

    /**
     * 审核全局小组件
     *
     * @param opUserId  操作用户
     * @param body      请求参数
     * @author Pengap
     * @date 2022/3/15 20:36:22
     */
    void auditSubmitData(Long opUserId, WidgetAuditSubmitDataRo body);

}
