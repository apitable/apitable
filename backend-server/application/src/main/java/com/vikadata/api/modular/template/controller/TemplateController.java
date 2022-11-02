package com.vikadata.api.modular.template.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.util.BooleanUtil;
import cn.hutool.json.JSONUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.Notification;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.bean.UserSpaceDto;
import com.vikadata.api.cache.service.SpaceCapacityCacheService;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.notification.NotificationTemplateId;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.constants.AuditConstants;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.permission.NodePermission;
import com.vikadata.api.control.role.ControlRoleManager;
import com.vikadata.api.control.role.RoleConstants.Node;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.enums.audit.AuditSpaceAction;
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.event.AuditSpaceEvent;
import com.vikadata.api.event.AuditSpaceEvent.AuditSpaceArg;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.model.dto.template.TemplateInfo;
import com.vikadata.api.model.ro.template.CreateTemplateRo;
import com.vikadata.api.model.ro.template.QuoteTemplateRo;
import com.vikadata.api.model.ro.template.TemplateCenterConfigRo;
import com.vikadata.api.model.vo.node.NodeInfoVo;
import com.vikadata.api.model.vo.template.RecommendVo;
import com.vikadata.api.model.vo.template.TemplateCategoryContentVo;
import com.vikadata.api.model.vo.template.TemplateCategoryMenuVo;
import com.vikadata.api.model.vo.template.TemplateDirectoryVo;
import com.vikadata.api.model.vo.template.TemplateSearchResultVo;
import com.vikadata.api.model.vo.template.TemplateVo;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.social.service.IDingTalkDaService;
import com.vikadata.api.modular.template.mapper.TemplateMapper;
import com.vikadata.api.modular.template.model.TemplateSearchDTO;
import com.vikadata.api.modular.template.service.ITemplateCenterConfigService;
import com.vikadata.api.modular.template.service.ITemplateService;
import com.vikadata.api.modular.workspace.model.NodeCopyOptions;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.AuthException.FORBIDDEN;
import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;
import static com.vikadata.api.enums.exception.TemplateException.TEMPLATE_INFO_ERROR;

/**
 * <p>
 * Template Center - Template API
 * </p>
 */
@RestController
@Api(tags = "Template Center - Template API")
@ApiResource(path = "/")
public class TemplateController {

    @Resource
    private ITemplateService iTemplateService;

    @Resource
    private TemplateMapper templateMapper;

    @Resource
    private INodeService iNodeService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private SensorsService sensorsService;

    @Resource
    private IDingTalkDaService iDingTalkDaService;

    @Resource
    private SpaceCapacityCacheService spaceCapacityCacheService;

    @Resource
    private ITemplateCenterConfigService iTemplateCenterConfigService;

    @Resource
    private IGmService iGmService;

    @GetResource(path = "/template/global/search", requiredLogin = false)
    @ApiOperation(value = "Template Global Search")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "keyword", value = "Search Keyword", required = true, dataTypeClass = String.class, paramType = "query", example = "plan"),
            @ApiImplicitParam(name = "className", value = "Highlight Style Class Name", dataTypeClass = String.class, paramType = "query", example = "highLight")
    })
    public ResponseData<TemplateSearchResultVo> globalSearch(@RequestParam(name = "keyword") String keyword,
            @RequestParam(value = "className", required = false, defaultValue = "keyword") String className) {
        String lang = LoginContext.me().getLocaleStrWithUnderLine();
        // search template related content
        TemplateSearchDTO result = iTemplateService.globalSearchTemplate(lang, keyword, className);
        // sensors data track
        Long userId = SessionContext.getUserIdWithoutException();
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        TaskManager.me().execute(() -> {
            Map<String, Object> properties = new HashMap<>(3);
            properties.put("keyword", keyword);
            properties.put("albumNames", result.getAlbumNames());
            properties.put("templateName", result.getTemplateNames());
            properties.put("tagName", result.getTagNames());
            sensorsService.eventTrack(userId, TrackEventType.SEARCH_TEMPLATE, properties, origin);
        });
        return ResponseData.success(new TemplateSearchResultVo(result.getAlbums(), result.getTemplates()));
    }


    @GetResource(path = "/template/recommend", requiredLogin = false)
    @ApiOperation(value = "Get Template Recommend Content")
    public ResponseData<RecommendVo> recommend() {
        String lang = LoginContext.me().getLocaleStrWithUnderLine();
        RecommendVo vo = iTemplateService.getRecommend(lang);
        return ResponseData.success(vo);
    }

    @GetResource(path = "/template/categoryList", requiredLogin = false)
    @ApiOperation(value = "Get Template Category List")
    public ResponseData<List<TemplateCategoryMenuVo>> getCategoryList() {
        String lang = LoginContext.me().getLocaleStrWithUnderLine();
        List<TemplateCategoryMenuVo> list = iTemplateService.getTemplateCategoryList(lang);
        return ResponseData.success(list);
    }

    @GetResource(path = "/template/categories/{categoryCode}", requiredLogin = false)
    @ApiOperation(value = "Get The Template Category Content")
    @ApiImplicitParam(name = "categoryCode", value = "Template Category Code", dataTypeClass = String.class, paramType = "path", example = "tpcEm7VDcbnnr")
    public ResponseData<TemplateCategoryContentVo> getCategoryContent(@PathVariable("categoryCode") String categoryCode) {
        return ResponseData.success(iTemplateService.getTemplateCategoryContentVo(categoryCode));
    }

    @GetResource(path = "/spaces/{spaceId}/templates", requiredPermission = false)
    @ApiOperation(value = "Get Space Templates")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "Space Id", dataTypeClass = String.class, paramType = "path", example = "spczJrh2i3tLW")
    public ResponseData<List<TemplateVo>> getSpaceTemplates(@PathVariable("spaceId") String spaceId) {
        // check if the user is in the space
        LoginContext.me().getUserSpaceDto(spaceId);
        List<TemplateVo> vos = iTemplateService.getTemplateVoList(spaceId, null, null, Boolean.TRUE);
        return ResponseData.success(vos);
    }

    @GetResource(path = "/template/directory", requiredLogin = false)
    @ApiOperation(value = "Get Template Directory Info")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "categoryCode", value = "Official Template Category Code", dataTypeClass = String.class, paramType = "query", example = "tpcEm7VDcbnnr"),
            @ApiImplicitParam(name = "templateId", value = "Template Id", required = true, dataTypeClass = String.class, paramType = "query", example = "tplHTbkg7qbNJ"),
            @ApiImplicitParam(name = "isPrivate", value = "Whether it is a private template in the space station", defaultValue = "false", dataTypeClass = Boolean.class, paramType = "query", example = "true")
    })
    public ResponseData<TemplateDirectoryVo> directory(@RequestParam("templateId") String templateId,
            @RequestParam(name = "categoryCode", required = false) String categoryCode,
            @RequestParam(value = "isPrivate", required = false, defaultValue = "false") Boolean isPrivate) {
        // Get the space id(the method includes judging whether the template exists)
        String spaceId = iTemplateService.getSpaceId(templateId);
        String lang = LoginContext.me().getLocaleStrWithUnderLine();
        // The requirement is the official template or the current space template
        if (!constProperties.getTemplateSpace().contains(spaceId) || Boolean.TRUE.equals(isPrivate)) {
            // Unofficial templates or view the current space template to verify whether the user is in the space
            LoginContext.me().getUserSpaceDto(spaceId);
        }
        TemplateDirectoryVo vo = iTemplateService.getDirectoryVo(categoryCode, templateId, isPrivate, lang);
        return ResponseData.success(vo);
    }

    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    @PostResource(path = "/template/quote", requiredPermission = false)
    @ApiOperation(value = "Quote Template")
    @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "user socket id", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    public ResponseData<NodeInfoVo> quote(@RequestBody @Valid QuoteTemplateRo ro) {
        Long userId = SessionContext.getUserId();
        // Get the space id(the method includes judging whether the node exists)
        String spaceId = iNodeService.getSpaceIdByNodeId(ro.getParentId());
        SpaceHolder.set(spaceId);
        // Get the member ID(the method includes judging whether the user is in this space)
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, spaceId, ro.getParentId());
        // Check node permissions
        controlTemplate.checkNodePermission(memberId, ro.getParentId(), NodePermission.CREATE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // Check if the template exists
        TemplateInfo info = templateMapper.selectInfoByTempId(ro.getTemplateId());
        ExceptionUtil.isTrue(info != null && (spaceId.equals(info.getTypeId()) ||
                constProperties.getTemplateSpace().equals(info.getTypeId())), TEMPLATE_INFO_ERROR);
        // Copy the node to the specified space directory
        String nodeId = iNodeService.copyNodeToSpace(userId, spaceId, ro.getParentId(), info.getNodeId(),
                NodeCopyOptions.builder().copyData(BooleanUtil.isTrue(ro.getData())).verifyNodeCount(true).sourceTemplateId(ro.getTemplateId()).build());
        // Cumulative template usage times
        TaskManager.me().execute(() -> templateMapper.updateUsedTimesByTempId(ro.getTemplateId(), 1));
        // DingTalk template application creation
        TaskManager.me().execute(() -> iDingTalkDaService.handleTemplateQuoted(spaceId, nodeId, ro.getTemplateId(), memberId));
        // Publish space audit event
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.QUOTE_TEMPLATE).userId(userId).spaceId(spaceId).nodeId(nodeId)
                .info(JSONUtil.createObj().set(AuditConstants.TEMPLATE_ID, ro.getTemplateId()).set(AuditConstants.TEMPLATE_NAME, info.getName()).set(AuditConstants.RECORD_COPYABLE, ro.getData())).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success(iNodeService.getNodeInfoByNodeId(spaceId, nodeId, ControlRoleManager.parseNodeRole(Node.MANAGER)));
    }

    @GetResource(path = "/template/validate")
    @ApiOperation(value = "Check if the template name already exists", notes = "Called before creating a template, the same name will overwrite the old template, you need to confirm the operation again")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "Space Id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW"),
            @ApiImplicitParam(name = "name", value = "Template Name", required = true, dataTypeClass = String.class, paramType = "query", example = "this is a template")
    })
    public ResponseData<Boolean> validate(@RequestParam("name") String name) {
        String spaceId = LoginContext.me().getSpaceId();
        boolean exist = templateMapper.selectIdByTypeIdAndName(spaceId, name) != null;
        return ResponseData.success(exist);
    }

    @PostResource(path = "/template/create", requiredPermission = false)
    @ApiOperation(value = "Create Template", notes = "Created nodes (including child descendant nodes) have administrative rights and are not associated with data tables other than nodes.")
    public ResponseData<String> create(@RequestBody @Valid CreateTemplateRo ro) {
        Long userId = SessionContext.getUserId();
        // Get the space id(the method includes judging whether the node exists)
        String spaceId = iNodeService.getSpaceIdByNodeId(ro.getNodeId());
        SpaceHolder.set(spaceId);
        // Get the member ID(the method includes judging whether the user is in this space)
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // Check node permissions
        controlTemplate.checkNodePermission(memberId, ro.getNodeId(), NodePermission.MANAGE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // Requirements for verifying various types of nodes
        iTemplateService.checkTemplateForeignNode(memberId, ro.getNodeId());
        String templateId = iTemplateService.create(userId, spaceId, ro);
        // Delete space capacity cache
        spaceCapacityCacheService.del(spaceId);
        // Publish space audit event
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.CREATE_TEMPLATE).userId(userId).spaceId(spaceId).nodeId(ro.getNodeId())
                .info(JSONUtil.createObj().set(AuditConstants.TEMPLATE_ID, templateId).set(AuditConstants.RECORD_COPYABLE, ro.getData())).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success(templateId);
    }

    @PostResource(path = "/template/delete/{templateId}", method = RequestMethod.DELETE, requiredPermission = false)
    @ApiOperation(value = "Delete Template", notes = "Deletion objects: main administrator, sub-admins with template permissions, creator of the template")
    @ApiImplicitParam(name = "templateId", value = "Template ID", required = true, dataTypeClass = String.class, paramType = "path", example = "tplHTbkg7qbNJ")
    public ResponseData<Void> delete(@PathVariable("templateId") String templateId) {
        Long userId = SessionContext.getUserId();
        // Get the space id(the method includes judging whether the template exists)
        String spaceId = iTemplateService.getSpaceId(templateId);
        SpaceHolder.set(spaceId);
        // Check if user is in this space
        UserSpaceDto userSpaceDto = userSpaceService.getUserSpace(userId, spaceId);
        // Determine whether it is the main administrator, or a sub-admin with template permissions
        boolean isManager = userSpaceDto.isMainAdmin() ||
                (userSpaceDto.isAdmin() && userSpaceDto.getResourceCodes().contains("DELETE_TEMPLATE"));
        if (!isManager) {
            // Templates can be overridden, the last modifier is the creator
            Long creator = templateMapper.selectUpdatersByTempId(templateId);
            ExceptionUtil.isTrue(userId.equals(creator), FORBIDDEN);
        }
        // Delete template
        iTemplateService.delete(userId, templateId);
        // Delete space capacity cache
        spaceCapacityCacheService.del(spaceId);
        // Publish space audit event
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.DELETE_TEMPLATE).userId(userId).spaceId(spaceId)
                .info(JSONUtil.createObj().set(AuditConstants.TEMPLATE_ID, templateId)).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    @PostResource(path = "/template/config", requiredPermission = false)
    @ApiOperation(value = "Update Template Center Config")
    public ResponseData<Void> config(@RequestBody @Valid TemplateCenterConfigRo ro) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.TEMPLATE_CENTER_CONFIG);
        iTemplateCenterConfigService.updateTemplateCenterConfig(userId, ro);
        return ResponseData.success();
    }
}
