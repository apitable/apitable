package com.vikadata.api.enterprise.widget.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import com.apitable.starter.vika.core.model.GlobalWidgetInfo;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageBanRo;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageCreateRo;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageReleaseRo;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageReleaseV2Ro;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageRollbackRo;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageSubmitRo;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageSubmitV2Ro;
import com.vikadata.api.enterprise.widget.ro.WidgetPackageUnpublishRo;
import com.vikadata.api.enterprise.widget.ro.WidgetTransferOwnerRo;
import com.vikadata.api.enterprise.widget.vo.WidgetPackageInfoVo;
import com.vikadata.api.enterprise.widget.vo.WidgetReleaseCreateVo;
import com.vikadata.api.enterprise.widget.vo.WidgetReleaseListVo;
import com.vikadata.api.enterprise.gm.model.SingleGlobalWidgetRo;
import com.vikadata.entity.WidgetPackageEntity;
public interface IWidgetPackageService extends IService<WidgetPackageEntity> {

    /**
     * check if the component installation package exists
     *
     * @param widgetPackageId widget id
     * @param status          installation package status
     */
    void checkWidgetPackIfExist(String widgetPackageId, List<Integer> status);

    /**
     * @param customPackageId custom widget id
     * @return whether widget exist
     */
    boolean checkCustomPackageId(String customPackageId);

    /**
     * @param opUserId  opUserId
     * @param widget create widget package request parameters
     * @return widget id
     */
    WidgetReleaseCreateVo createWidget(Long opUserId, WidgetPackageCreateRo widget);

    /**
     * @param opUserId  opUserId
     * @param widget    publish widget request parameters
     * @return release operation status
     */
    boolean releaseWidget(Long opUserId, WidgetPackageReleaseRo widget);

    /**
     * get a list of publishing history
     *
     * @param opUserId  opUserId
     * @param packageId widget id
     * @param page page object
     * @return publish list
     */
    List<WidgetReleaseListVo> releaseListWidget(Long opUserId, String packageId, Page<WidgetReleaseListVo> page);

    /**
     * @param opUserId  opUserId
     * @param widget rollback widget request parameters
     * @return rollback operation status
     */
    boolean rollbackWidget(Long opUserId, WidgetPackageRollbackRo widget);

    /**
     * @param opUserId  opUserId
     * @param widget    unpublish widget request parameters
     * @return unpublish widget status
     */
    boolean unpublishWidget(Long opUserId, WidgetPackageUnpublishRo widget);

    /**
     * @param opUserId  opUserId
     * @param widget prohibited and unblocked request parameters
     * @return operation status of forbidden and unsealed widgets
     */
    boolean banWindget(Long opUserId, WidgetPackageBanRo widget);

    /**
     *
     * @param packageId widget id
     * @return WidgetPackageInfoVo
     */
    WidgetPackageInfoVo getWidgetPackageInfo(String packageId);

    /**
     * @param spaceId space id
     * @return WidgetPackageInfoVo
     */
    List<WidgetPackageInfoVo> getWidgetPackageListInfo(String spaceId);

    /**
     * @param opUserId          opUserId
     * @param transferOwnerRo   request to transfer widget parameters
     */
    void transferWidgetOwner(Long opUserId, WidgetTransferOwnerRo transferOwnerRo);

    /**
     * @param nodeId node id
     * @return Global widget information for external network space configuration
     */
    List<GlobalWidgetInfo> getGlobalWidgetPackageConfiguration(String nodeId);

    /**
     * refresh global widget db data
     *
     * @param nodeId node id
     */
    void globalWidgetDbDataRefresh(String nodeId);

    /**
     * single widget data refresh
     *
     * @param body  requestor
     */
    void singleGlobalWidgetRefresh(SingleGlobalWidgetRo body);

    /**
     * @param opUserId  opUserId
     * @param widget    publish widget request parameters
     * @return submit operation status
     */
    boolean submitWidget(Long opUserId, WidgetPackageSubmitRo widget);

    /**
     * @param packageId widget id
     * @param checkBan  check if the widget is disabled
     * @return WidgetPackageEntity
     */
    WidgetPackageEntity getByPackageId(String packageId, boolean checkBan);

    /**
     * Query the basic information of the applet without checking whether it is blocked
     *
     * @param packageId packageId
     */
    default WidgetPackageEntity getByPackageId(String packageId) {
        return getByPackageId(packageId, false);
    }

    /**
     * @param opUserId  opUserId
     * @param widget    publish widget request parameters
     * @return release operation status
     */
    boolean releaseWidget(Long opUserId, WidgetPackageReleaseV2Ro widget);

    /**
     * @param opUserId  opUserId
     * @param widget    publish widget request parameters
     * @return submit operation status
     */
    boolean submitWidget(Long opUserId, WidgetPackageSubmitV2Ro widget);
}
