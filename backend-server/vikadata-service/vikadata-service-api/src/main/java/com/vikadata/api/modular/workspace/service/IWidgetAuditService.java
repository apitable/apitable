package com.vikadata.api.modular.workspace.service;

import java.util.List;

import com.vikadata.api.model.ro.widget.WidgetAuditSubmitDataRo;
import com.vikadata.api.model.ro.widget.WidgetAuditGlobalIdRo;
import com.vikadata.api.model.ro.widget.WidgetStoreListRo;
import com.vikadata.api.model.vo.widget.WidgetStoreListInfo;

public interface IWidgetAuditService {

    /**
     * issue global id
     *
     * @param opUserId       opUserId
     * @param body  request parameters
     * @return boolean
     */
    String issuedGlobalId(Long opUserId, WidgetAuditGlobalIdRo body);

    /**
     * query the list of small programs to be reviewed
     *
     * @param body  request parameters
     * @return list to be reviewed
     * 
     * 
     */
    List<WidgetStoreListInfo> waitReviewWidgetList(WidgetStoreListRo body);

    /**
     * audit global widgets
     *
     * @param opUserId  operating user
     * @param body      request parameters
     */
    void auditSubmitData(Long opUserId, WidgetAuditSubmitDataRo body);

}
