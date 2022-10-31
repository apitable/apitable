package com.vikadata.api.modular.template.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
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
import com.vikadata.api.model.vo.template.TemplateSearchResult;
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
 *
 * @author Chambers
 * @date 2020/5/12
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

    @Deprecated
    @GetResource(path = "/template/search", requiredLogin = false)
    @ApiOperation(value = "Template Search")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "keyword", value = "Search Keyword", required = true, dataTypeClass = String.class, paramType = "query", example = "plan"),
            @ApiImplicitParam(name = "className", value = "Highlight Style Class Name", dataTypeClass = String.class, paramType = "query", example = "highLight")
    })
    public ResponseData<List<TemplateSearchResult>> search(@RequestParam(name = "keyword") String keyword,
            @RequestParam(value = "className", required = false, defaultValue = "keyword") String className) {
        String lang = LoginContext.me().getLocaleStrWithUnderLine();
        List<TemplateSearchResult> results = iTemplateService.searchTemplate(keyword, lang);
        // replace style of keyword
        Set<String> resultTemplateNames = new HashSet<>(results.size());
        Set<String> resultTags = new HashSet<>();
        results.forEach(result -> {
            resultTemplateNames.add(result.getTemplateName());
            result.setTemplateName(InformationUtil.keywordHighlight(result.getTemplateName(), keyword, className));
            if (result.getTags() != null) {
                List<String> tags = new ArrayList<>(result.getTags().size());
                for (String tag : result.getTags()) {
                    resultTags.add(tag);
                    tags.add(InformationUtil.keywordHighlight(tag, keyword, className));
                }
                result.setTags(tags);
            }
        });
        // sensors data track
        Long userId = SessionContext.getUserIdWithoutException();
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        TaskManager.me().execute(() -> {
            Map<String, Object> properties = new HashMap<>(3);
            properties.put("keyword", keyword);
            properties.put("templateName", new ArrayList<>(resultTemplateNames));
            properties.put("tagName", new ArrayList<>(resultTags));
            sensorsService.eventTrack(userId, TrackEventType.SEARCH_TEMPLATE, properties, origin);
        });
        return ResponseData.success(results);
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

    @Deprecated
    @GetResource(path = "/template/list", requiredLogin = false)
    @ApiOperation(value = "获取模版列表", notes = "场景：1、指定分类(官方模板分类);2、spaceId(空间站全部模板)")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW"),
            @ApiImplicitParam(name = "categoryCode", value = "模版分类code", dataTypeClass = String.class, paramType = "query", example = "tpcEm7VDcbnnr"),
    })
    public ResponseData<List<TemplateVo>> list(@RequestParam(name = "categoryCode", required = false) String categoryCode) {
        String spaceId;
        Boolean isPrivate = null;
        if (StrUtil.isNotBlank(categoryCode)) {
            spaceId = constProperties.getTemplateSpace();
        }
        else {
            spaceId = LoginContext.me().getSpaceId();
            // 校验用户是否在该空间内
            LoginContext.me().getUserSpaceDto(spaceId);
            isPrivate = Boolean.TRUE;
        }
        List<TemplateVo> vos = iTemplateService.getTemplateVoList(spaceId, categoryCode, null, isPrivate);
        return ResponseData.success(vos);
    }

    @GetResource(path = "/template/directory", requiredLogin = false)
    @ApiOperation(value = "获取模板目录信息", notes = "须为官方模板或者当前所在空间模板")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "categoryCode", value = "模版分类code", dataTypeClass = String.class, paramType = "query", example = "tpcEm7VDcbnnr"),
            @ApiImplicitParam(name = "templateId", value = "模版ID", required = true, dataTypeClass = String.class, paramType = "query", example = "tplHTbkg7qbNJ"),
            @ApiImplicitParam(name = "isPrivate", value = "是否属于空间站", defaultValue = "false", dataTypeClass = Boolean.class, paramType = "query", example = "true")
    })
    public ResponseData<TemplateDirectoryVo> directory(@RequestParam("templateId") String templateId,
            @RequestParam(name = "categoryCode", required = false) String categoryCode,
            @RequestParam(value = "isPrivate", required = false, defaultValue = "false") Boolean isPrivate) {
        // 获取空间ID，方法包含判断模板是否存在
        String spaceId = iTemplateService.getSpaceId(templateId);
        String lang = LoginContext.me().getLocaleStrWithUnderLine();
        // 要求是官方模板或者当前所在空间模板
        if (!constProperties.getTemplateSpace().contains(spaceId) || Boolean.TRUE.equals(isPrivate)) {
            // 非官方模板或查看当前空间模板，校验用户是否在该空间内
            LoginContext.me().getUserSpaceDto(spaceId);
        }
        TemplateDirectoryVo vo = iTemplateService.getDirectoryVo(categoryCode, templateId, isPrivate, lang);
        return ResponseData.success(vo);
    }

    @Notification(templateId = NotificationTemplateId.NODE_CREATE)
    @PostResource(path = "/template/quote", requiredPermission = false)
    @ApiOperation(value = "引用模板")
    @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "用户socketId", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl")
    public ResponseData<NodeInfoVo> quote(@RequestBody @Valid QuoteTemplateRo ro) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(ro.getParentId());
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, spaceId, ro.getParentId());
        // 校验节点权限
        controlTemplate.checkNodePermission(memberId, ro.getParentId(), NodePermission.CREATE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 校验模板是否存在
        TemplateInfo info = templateMapper.selectInfoByTempId(ro.getTemplateId());
        ExceptionUtil.isTrue(info != null && (spaceId.equals(info.getTypeId()) ||
                constProperties.getTemplateSpace().equals(info.getTypeId())), TEMPLATE_INFO_ERROR);
        // 复制节点到指定空间目录
        String nodeId = iNodeService.copyNodeToSpace(userId, spaceId, ro.getParentId(), info.getNodeId(),
                NodeCopyOptions.builder().copyData(BooleanUtil.isTrue(ro.getData())).verifyNodeCount(true).sourceTemplateId(ro.getTemplateId()).build());
        // 累计模板使用次数
        TaskManager.me().execute(() -> templateMapper.updateUsedTimesByTempId(ro.getTemplateId(), 1));
        // 钉钉搭模版应用创建
        TaskManager.me().execute(() -> iDingTalkDaService.handleTemplateQuoted(spaceId, nodeId, ro.getTemplateId(), memberId));
        // 发布空间审计事件
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.QUOTE_TEMPLATE).userId(userId).spaceId(spaceId).nodeId(nodeId)
                .info(JSONUtil.createObj().set(AuditConstants.TEMPLATE_ID, ro.getTemplateId()).set(AuditConstants.TEMPLATE_NAME, info.getName()).set(AuditConstants.RECORD_COPYABLE, ro.getData())).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success(iNodeService.getNodeInfoByNodeId(spaceId, nodeId, ControlRoleManager.parseNodeRole(Node.MANAGER)));
    }

    @GetResource(path = "/template/validate")
    @ApiOperation(value = "校验模版名称是否已存在", notes = "创建模版之前调用，相同名称会覆盖旧模板，需再次确认操作")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW"),
            @ApiImplicitParam(name = "name", value = "模版名称", required = true, dataTypeClass = String.class, paramType = "query", example = "这是一个模板名称")
    })
    public ResponseData<Boolean> validate(@RequestParam("name") String name) {
        String spaceId = LoginContext.me().getSpaceId();
        boolean exist = templateMapper.selectIdByTypeIdAndName(spaceId, name) != null;
        return ResponseData.success(exist);
    }

    @PostResource(path = "/template/create", requiredPermission = false)
    @ApiOperation(value = "创建模版", notes = "创建对象：创建的节点（包括子后代节点）均有可管理权限，且未关联节点之外的数表")
    public ResponseData<String> create(@RequestBody @Valid CreateTemplateRo ro) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(ro.getNodeId());
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // 校验节点权限
        controlTemplate.checkNodePermission(memberId, ro.getNodeId(), NodePermission.MANAGE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // 校验各种类型节点的要求
        iTemplateService.checkTemplateForeignNode(memberId, ro.getNodeId());
        String templateId = iTemplateService.create(userId, spaceId, ro);
        // 删除空间容量缓存
        spaceCapacityCacheService.del(spaceId);
        // 发布空间审计事件
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.CREATE_TEMPLATE).userId(userId).spaceId(spaceId).nodeId(ro.getNodeId())
                .info(JSONUtil.createObj().set(AuditConstants.TEMPLATE_ID, templateId).set(AuditConstants.RECORD_COPYABLE, ro.getData())).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success(templateId);
    }

    @PostResource(path = "/template/delete/{templateId}", method = RequestMethod.DELETE, requiredPermission = false)
    @ApiOperation(value = "删除模版", notes = "删除对象：主管理员、拥有模板权限的子管理员、模板的创建者")
    @ApiImplicitParam(name = "templateId", value = "模版ID", required = true, dataTypeClass = String.class, paramType = "path", example = "tplHTbkg7qbNJ")
    public ResponseData<Void> delete(@PathVariable("templateId") String templateId) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断模板是否存在
        String spaceId = iTemplateService.getSpaceId(templateId);
        SpaceHolder.set(spaceId);
        // 校验用户是否在此空间
        UserSpaceDto userSpaceDto = userSpaceService.getUserSpace(userId, spaceId);
        // 判断是否是主管理员，或拥有模板权限的子管理员
        boolean isManager = userSpaceDto.isMainAdmin() ||
                (userSpaceDto.isAdmin() && userSpaceDto.getResourceCodes().contains("DELETE_TEMPLATE"));
        if (!isManager) {
            // 模板可覆盖，最后修改者即创建者
            Long creator = templateMapper.selectUpdatersByTempId(templateId);
            ExceptionUtil.isTrue(userId.equals(creator), FORBIDDEN);
        }
        // 删除模板
        iTemplateService.delete(userId, templateId);
        // 删除空间容量缓存
        spaceCapacityCacheService.del(spaceId);
        // 发布空间审计事件
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.DELETE_TEMPLATE).userId(userId).spaceId(spaceId)
                .info(JSONUtil.createObj().set(AuditConstants.TEMPLATE_ID, templateId)).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
        return ResponseData.success();
    }

    @PostResource(path = "/template/oneClickGenerate/{nodeId}", requiredPermission = false)
    @ApiOperation(value = "一键生成模板", notes = "取下级节点作为分类，下下级节点生成模板。例如：目录树 A-B-C，传入A，则创建一个分类为B的模板C")
    @ApiImplicitParam(name = "nodeId", value = "节点ID", required = true, dataTypeClass = String.class, paramType = "path", example = "fodj6QjYL0ZGy")
    public ResponseData<String> oneClickGenerate(@PathVariable("nodeId") String nodeId) {
        Long userId = SessionContext.getUserId();
        // 获取空间ID，方法包含判断模板是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(nodeId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        String result = iTemplateService.oneClickGenerate(userId, spaceId, memberId, nodeId);
        return ResponseData.success(result);
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
