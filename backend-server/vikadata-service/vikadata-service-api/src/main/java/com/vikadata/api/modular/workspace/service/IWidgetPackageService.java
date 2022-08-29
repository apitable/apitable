package com.vikadata.api.modular.workspace.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.model.ro.widget.WidgetPackageBanRo;
import com.vikadata.api.model.ro.widget.WidgetPackageCreateRo;
import com.vikadata.api.model.ro.widget.WidgetPackageReleaseRo;
import com.vikadata.api.model.ro.widget.WidgetPackageRollbackRo;
import com.vikadata.api.model.ro.widget.WidgetPackageSubmitRo;
import com.vikadata.api.model.ro.widget.WidgetPackageUnpublishRo;
import com.vikadata.api.model.ro.widget.WidgetTransferOwnerRo;
import com.vikadata.api.model.vo.widget.WidgetPackageInfoVo;
import com.vikadata.api.model.vo.widget.WidgetReleaseCreateVo;
import com.vikadata.api.model.vo.widget.WidgetReleaseListVo;
import com.vikadata.api.modular.developer.model.SingleGlobalWidgetRo;
import com.vikadata.entity.WidgetPackageEntity;
import com.vikadata.integration.vika.model.GlobalWidgetInfo;

/**
 * @author Shawn Deng
 * @date 2021-01-09 16:21:40
 */
public interface IWidgetPackageService extends IService<WidgetPackageEntity> {

    /**
     * 检查组件安装包是否存在
     *
     * @param widgetPackageId 安装包ID
     * @param status          安装包状态
     * @author Chambers
     * @date 2021/1/25
     */
    void checkWidgetPackIfExist(String widgetPackageId, List<Integer> status);

    /**
     * 检查自定义小组件Id是否存在
     *
     * @param customPackageId 自定义包Id
     * @return 包Id是否存在
     * @author Pengap
     * @date 2021/7/8
     */
    boolean checkCustomPackageId(String customPackageId);

    /**
     * 创建小组件包
     *
     * @param opUserId  操作用户
     * @param widget 创建小组件包请求参数
     * @return 创建的组件包ID
     * @author Pengap
     * @date 2021/7/8
     */
    WidgetReleaseCreateVo createWidget(Long opUserId, WidgetPackageCreateRo widget);

    /**
     * 发布小组件
     *
     * @param opUserId  操作用户
     * @param widget    发布小组件请求参数
     * @return 发布操作状态
     * @author Pengap
     * @date 2021/7/8
     */
    boolean releaseWidget(Long opUserId, WidgetPackageReleaseRo widget);

    /**
     * 获取发布历史列表
     *
     * @param opUserId  操作用户
     * @param packageId 小组件包Id
     * @param page 分页请求对象
     * @return 发布列表
     * @author Pengap
     * @date 2021/7/8
     */
    List<WidgetReleaseListVo> releaseListWidget(Long opUserId, String packageId, Page<WidgetReleaseListVo> page);

    /**
     * 回滚小组件
     *
     * @param opUserId  操作用户
     * @param widget 回滚小组件请求参数
     * @return 回滚操作状态
     * @author Pengap
     * @date 2021/7/8
     */
    boolean rollbackWidget(Long opUserId, WidgetPackageRollbackRo widget);

    /**
     * 下架小组件
     *
     * @param opUserId  操作用户
     * @param widget    下架小组件请求参数
     * @return 下架小组件状态
     * @author Pengap
     * @date 2021/7/8
     */
    boolean unpublishWidget(Long opUserId, WidgetPackageUnpublishRo widget);

    /**
     * 禁封/解封小组件
     *
     * @param opUserId  操作用户
     * @param widget 禁封/解封请求参数
     * @return 禁封/解封小组件操作状态
     * @author Pengap
     * @date 2021/7/8
     */
    boolean banWindget(Long opUserId, WidgetPackageBanRo widget);

    /**
     * 获取小组件包信息
     *
     * @param packageId 小组件包Id
     * @return 小组件包信息
     * @author Pengap
     * @date 2021/7/8
     */
    WidgetPackageInfoVo getWidgetPackageInfo(String packageId);

    /**
     * 获取小组件商店信息
     *
     * @param spaceId 空间站Id
     * @return 小组件包信息
     * @author Pengap
     * @date 2021/7/8
     */
    List<WidgetPackageInfoVo> getWidgetPackageListInfo(String spaceId);
    /**
     * 转移小组件拥有者
     *
     * @param opUserId          用户Id
     * @param transferOwnerRo   请求转移小组件参数
     * @author Pengap
     * @date 2021/9/28 17:49:11
     */
    void transferWidgetOwner(Long opUserId, WidgetTransferOwnerRo transferOwnerRo);

    /**
     * 获取全局小组件配置
     *
     * @param nodeId 节点Id
     * @return vika外网空间配置的全局小组件信息
     * @author Pengap
     * @date 2021/9/29 16:13:57
     */
    List<GlobalWidgetInfo> getGlobalWidgetPackageConfiguration(String nodeId);

    /**
     * 刷新全局小组件DB数据
     *
     * @param nodeId 节点Id
     * @author Pengap
     * @date 2021/9/30 11:55:25
     */
    void globalWidgetDbDataRefresh(String nodeId);

    /**
     * 单个小组件数据刷新
     *
     * @param body  请求体
     * @author Pengap
     * @date 2021/11/10 16:45:37
     */
    void singleGlobalWidgetRefresh(SingleGlobalWidgetRo body);

    /**
     * 提交全局小组件审核
     *
     * @param opUserId  操作用户
     * @param widget    发布小组件请求参数
     * @return 提交操作状态
     * @author Pengap
     * @date 2022/3/7 22:43:51
     */
    boolean submitWidget(Long opUserId, WidgetPackageSubmitRo widget);

    /**
     * 查询小程序基本信息
     *
     * @param packageId 小程序Id
     * @param checkBan  检查小程序是否禁用
     * @return 小程序包信息
     * @author Pengap
     * @date 2022/3/16 18:39:12
     */
    WidgetPackageEntity getByPackageId(String packageId, boolean checkBan);

    /**
     * 查询小程序基本信息，不检查是否封禁
     *
     * @param packageId 小程序Id
     */
    default WidgetPackageEntity getByPackageId(String packageId) {
        return getByPackageId(packageId, false);
    }

}
