package com.vikadata.api.modular.workspace.controller;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.permission.NodePermission;
import com.vikadata.api.enums.exception.ParameterException;
import com.vikadata.api.enums.exception.WidgetException;
import com.vikadata.api.model.ro.widget.WidgetCopyRo;
import com.vikadata.api.model.ro.widget.WidgetCreateRo;
import com.vikadata.api.model.ro.widget.WidgetStoreListRo;
import com.vikadata.api.model.vo.widget.WidgetInfo;
import com.vikadata.api.model.vo.widget.WidgetPack;
import com.vikadata.api.model.vo.widget.WidgetPackageInfo;
import com.vikadata.api.model.vo.widget.WidgetStoreListInfo;
import com.vikadata.api.model.vo.widget.WidgetTemplatePackageInfo;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.workspace.mapper.WidgetMapper;
import com.vikadata.api.modular.workspace.mapper.WidgetPackageMapper;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.modular.workspace.service.IWidgetService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;

/**
 * <p>
 * 工作台模块_小程序管理接口
 * </p>
 *
 * @author Chambers
 * @date 2020/12/23
 */
@RestController
@Api(tags = "工作台模块_小程序管理接口")
@ApiResource(path = "/")
public class WidgetController {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private IWidgetService iWidgetService;

    @Resource
    private WidgetPackageMapper widgetPackageMapper;

    @Resource
    private WidgetMapper widgetMapper;

    @GetResource(path = "/widget/package/list", requiredPermission = false)
    @ApiOperation(value = "获取组件包列表 - 即将废弃", notes = "获取小组件包列表（标记为废弃的-升级0.8.2版本后可删除）")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW"),
            @ApiImplicitParam(name = "filter", value = "是否过滤未发布的小组件", defaultValue = "false", dataTypeClass = Boolean.class, paramType = "query", example = "true")
    })
    @Deprecated
    public ResponseData<List<WidgetPackageInfo>> findPackageList(@RequestParam(name = "filter", required = false, defaultValue = "false") Boolean filter) {
        Long userId = SessionContext.getUserId();
        String spaceId = LoginContext.me().getSpaceId();
        String userLocale = LocaleContextHolder.getLocale().toLanguageTag();
        // 小组包列表，看是否需要分页
        List<WidgetPackageInfo> infos = widgetPackageMapper.selectWidgetPackageList(userId, spaceId, filter, userLocale);
        return ResponseData.success(infos);
    }

    @PostResource(path = "/widget/package/store/list", requiredPermission = false)
    @ApiOperation(value = "获取小程序包商店列表", notes = "获取小程序包商店列表")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<List<WidgetStoreListInfo>> widgetStoreList(@RequestBody @Valid WidgetStoreListRo storeListRo) {
        Long userId = SessionContext.getUserId();
        String spaceId = LoginContext.me().getSpaceId();
        String userLocale = LocaleContextHolder.getLocale().toLanguageTag();
        storeListRo.setLanguage(Optional.ofNullable(storeListRo.getLanguage()).orElse(userLocale));
        List<WidgetStoreListInfo> infos = iWidgetService.widgetStoreList(userId, spaceId, storeListRo);
        return ResponseData.success(infos);
    }

    @GetResource(path = "/space/{spaceId}/widget", requiredPermission = false)
    @ApiOperation(value = "获取空间的小程序信息", notes = "获取整个空间下的小程序")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "spaceId", value = "空间ID", required = true, dataTypeClass = String.class, paramType = "path", example = "spczJrh2i3tLW"),
            @ApiImplicitParam(name = "count", value = "加载数量", dataTypeClass = Integer.class, paramType = "query", example = "10")
    })
    public ResponseData<List<WidgetInfo>> findWidgetInfoBySpaceId(@PathVariable("spaceId") String spaceId,
            @RequestParam(value = "count", required = false, defaultValue = "10") Integer count) {
        Long userId = SessionContext.getUserId();
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        List<WidgetInfo> infos = iWidgetService.getWidgetInfoList(spaceId, memberId, count);
        return ResponseData.success(infos);
    }

    @GetResource(path = "/node/{nodeId}/widget", requiredPermission = false)
    @ApiOperation(value = "获取节点的小程序信息", notes = "获取节点的小程序信息")
    @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "path", example = "dstJ2oRZxsh2yld4MA")
    public ResponseData<List<WidgetInfo>> findWidgetInfoByNodeId(@PathVariable("nodeId") String nodeId) {
        Long userId = SessionContext.getUserId();
        // 判断节点是否不存在或跨空间访问
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // 校验权限
        controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        List<WidgetInfo> infos = widgetMapper.selectInfoByNodeId(nodeId);
        return ResponseData.success(infos);
    }

    @GetResource(path = "/node/{nodeId}/widgetPack", requiredLogin = false)
    @ApiOperation(value = "获取节点下所有的小程序包信息", notes = "获取节点下所有的小程序包信息，节点类型仅限于仪表盘和数表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW"),
            @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "path", example = "dstJ2oRZxsh2yld4MA"),
            @ApiImplicitParam(name = "linkId", value = "关联ID：节点分享ID、模板ID", dataTypeClass = String.class, paramType = "query", example = "shr8T8vAfehg3yj3McmDG")
    })
    public ResponseData<List<WidgetPack>> findWidgetPackByNodeId(@PathVariable("nodeId") String nodeId,
            @RequestParam(value = "linkId", required = false) String linkId) {
        // 判断节点是否不存在或跨空间访问
        String nodeSpaceId = iNodeService.checkNodeIfExist(null, nodeId);
        if (StrUtil.isBlank(linkId)) {
            // 校验权限
            Long userId = SessionContext.getUserId();
            Long memberId = userSpaceService.getMemberId(userId, nodeSpaceId);
            controlTemplate.checkNodePermission(memberId, nodeId, NodePermission.READ_NODE,
                    status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        }
        else {
            // 站外访问
            String spaceId = iSpaceService.getSpaceIdByLinkId(linkId);
            ExceptionUtil.isTrue(nodeSpaceId.equals(spaceId), WidgetException.WIDGET_SPACE_ERROR);
        }
        // 获取节点下所有的组件
        List<String> widgetIds = widgetMapper.selectWidgetIdsByNodeId(nodeId);
        // 返回组件包信息
        return ResponseData.success(iWidgetService.getWidgetPackList(widgetIds));
    }

    @GetResource(path = "/widget/get", requiredLogin = false)
    @ApiOperation(value = "根据小程序ID获取小程序实例信息", notes = "获取小程序实例信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "widgetIds", value = "小程序ID 集合", required = true, dataTypeClass = String.class, paramType = "query", example = "wdtlMDweJzTsbSJAFY,wdt923ZpvvRhD8kVLs"),
            @ApiImplicitParam(name = "linkId", value = "关联ID：节点分享ID、模板ID", dataTypeClass = String.class, paramType = "query", example = "shr8T8vAfehg3yj3McmDG")
    })
    public ResponseData<List<WidgetPack>> findWidgetPackByWidgetIds(@RequestParam("widgetIds") List<String> widgetIds,
            @RequestParam(value = "linkId", required = false) String linkId) {
        ExceptionUtil.isNotEmpty(widgetIds, ParameterException.INCORRECT_ARG);
        String widgetSpaceId = iWidgetService.checkByWidgetIds(widgetIds);
        if (StrUtil.isBlank(linkId)) {
            Long userId = SessionContext.getUserId();
            // 防止访问未加入的空间
            userSpaceService.getMemberId(userId, widgetSpaceId);
        }
        else {
            // 站外访问
            String spaceId = iSpaceService.getSpaceIdByLinkId(linkId);
            ExceptionUtil.isTrue(widgetSpaceId.equals(spaceId), WidgetException.WIDGET_SPACE_ERROR);
        }
        // 返回组件包信息
        return ResponseData.success(iWidgetService.getWidgetPackList(widgetIds));
    }

    @PostResource(path = "/widget/create", requiredPermission = false)
    @ApiOperation(value = "创建小程序", notes = "场景：1、仪表盘新建小程序(无关联数表)；2、数表小程序面板新建小程序")
    public ResponseData<WidgetPack> createWidget(@RequestBody @Valid WidgetCreateRo widget) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(widget.getNodeId());
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // 校验权限
        controlTemplate.checkNodePermission(memberId, widget.getNodeId(), NodePermission.MANAGE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 创建组件
        String widgetId = iWidgetService.create(userId, spaceId, widget);
        return ResponseData.success(iWidgetService.getWidgetPack(widgetId));
    }

    @PostResource(path = "/widget/copy", requiredPermission = false)
    @ApiOperation(value = "复制小程序", notes = "场景：1、仪表盘导入小程序；2、小程序面板发送小程序到仪表盘")
    public ResponseData<List<WidgetPack>> copyWidget(@RequestBody @Valid WidgetCopyRo widgetRo) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(widgetRo.getDashboardId());
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getMemberId(userId, spaceId);
        // 校验权限
        controlTemplate.checkNodePermission(memberId, widgetRo.getDashboardId(), NodePermission.MANAGE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 复制组件
        Collection<String> widgetIds = iWidgetService.copyToDashboard(userId, spaceId, widgetRo.getDashboardId(), widgetRo.getWidgetIds());
        // 返回组件包信息
        return ResponseData.success(iWidgetService.getWidgetPackList(widgetIds));
    }

    @GetResource(path = "/widget/template/package/list", requiredPermission = false)
    @ApiOperation(value = "获取小程序模版列表", notes = "获取小程序模版列表")
    public ResponseData<List<WidgetTemplatePackageInfo>> findTemplatePackageList() {
        String userLocale = LocaleContextHolder.getLocale().toLanguageTag();
        List<WidgetTemplatePackageInfo> data = widgetPackageMapper.selectWidgetTemplatePackageList(userLocale);
        return ResponseData.success(data);
    }

}
