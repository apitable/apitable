/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.template.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.util.BooleanUtil;
import cn.hutool.json.JSONUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.apitable.auth.enums.AuthException;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.control.infrastructure.role.ControlRoleManager;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.interfaces.eventbus.facade.EventBusFacade;
import com.apitable.interfaces.eventbus.model.TemplateSearchEvent;
import com.apitable.interfaces.social.event.TemplateQuoteEvent;
import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.shared.cache.bean.UserSpaceDto;
import com.apitable.shared.cache.service.SpaceCapacityCacheService;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.component.notification.annotation.Notification;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.shared.constants.AuditConstants;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.holder.SpaceHolder;
import com.apitable.shared.listener.event.AuditSpaceEvent;
import com.apitable.shared.listener.event.AuditSpaceEvent.AuditSpaceArg;
import com.apitable.shared.util.information.ClientOriginInfo;
import com.apitable.shared.util.information.InformationUtil;
import com.apitable.space.enums.AuditSpaceAction;
import com.apitable.template.dto.TemplateInfo;
import com.apitable.template.enums.TemplateException;
import com.apitable.template.mapper.TemplateMapper;
import com.apitable.template.model.TemplateSearchDTO;
import com.apitable.template.ro.CreateTemplateRo;
import com.apitable.template.ro.QuoteTemplateRo;
import com.apitable.template.service.ITemplateService;
import com.apitable.template.vo.RecommendVo;
import com.apitable.template.vo.TemplateCategoryContentVo;
import com.apitable.template.vo.TemplateCategoryMenuVo;
import com.apitable.template.vo.TemplateDirectoryVo;
import com.apitable.template.vo.TemplateSearchResultVo;
import com.apitable.template.vo.TemplateVo;
import com.apitable.workspace.dto.NodeCopyOptions;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.vo.NodeInfoVo;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SpringContextHolder;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.apitable.workspace.enums.PermissionException.NODE_OPERATION_DENIED;

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
    private UserSpaceCacheService userSpaceCacheService;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    @Resource
    private EventBusFacade eventBusFacade;

    @Resource
    private SpaceCapacityCacheService spaceCapacityCacheService;

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
        ClientOriginInfo origin = InformationUtil.getClientOriginInfoInCurrentHttpContext(false, true);
        eventBusFacade.onEvent(new TemplateSearchEvent(userId, keyword, result.getAlbumNames(), result.getTemplateNames(), result.getTagNames(), origin));
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
        Long memberId = userSpaceCacheService.getMemberId(userId, spaceId);
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, spaceId, ro.getParentId());
        // Check node permissions
        controlTemplate.checkNodePermission(memberId, ro.getParentId(), NodePermission.CREATE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // Check if the template exists
        TemplateInfo info = templateMapper.selectInfoByTempId(ro.getTemplateId());
        ExceptionUtil.isTrue(info != null && (spaceId.equals(info.getTypeId()) ||
                constProperties.getTemplateSpace().equals(info.getTypeId())), TemplateException.TEMPLATE_INFO_ERROR);
        // Copy the node to the specified space directory
        String nodeId = iNodeService.copyNodeToSpace(userId, spaceId, ro.getParentId(), info.getNodeId(),
                NodeCopyOptions.builder().copyData(BooleanUtil.isTrue(ro.getData())).verifyNodeCount(true).sourceTemplateId(ro.getTemplateId()).build());
        // Cumulative template usage times
        TaskManager.me().execute(() -> templateMapper.updateUsedTimesByTempId(ro.getTemplateId(), 1));
        // DingTalk template application creation
        TaskManager.me().execute(() -> socialServiceFacade.eventCall(new TemplateQuoteEvent(spaceId, nodeId, ro.getTemplateId(), memberId)));
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
        Long memberId = userSpaceCacheService.getMemberId(userId, spaceId);
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
        UserSpaceDto userSpaceDto = userSpaceCacheService.getUserSpace(userId, spaceId);
        // Determine whether it is the main administrator, or a sub-admin with template permissions
        boolean isManager = userSpaceDto.isMainAdmin() ||
                (userSpaceDto.isAdmin() && userSpaceDto.getResourceCodes().contains("DELETE_TEMPLATE"));
        if (!isManager) {
            // Templates can be overridden, the last modifier is the creator
            Long creator = templateMapper.selectUpdatersByTempId(templateId);
            ExceptionUtil.isTrue(userId.equals(creator), AuthException.FORBIDDEN);
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
}
