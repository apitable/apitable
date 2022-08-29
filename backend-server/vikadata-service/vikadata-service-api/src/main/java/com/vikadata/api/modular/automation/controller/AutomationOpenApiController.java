package com.vikadata.api.modular.automation.controller;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.config.properties.LimitProperties;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.permission.NodePermission;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.modular.automation.model.AutomationApiTriggerCreateRo;
import com.vikadata.api.modular.automation.model.AutomationRobotDto;
import com.vikadata.api.modular.automation.model.AutomationTriggerCreateVo;
import com.vikadata.api.modular.automation.service.IAutomationRobotService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.AutomationException.DST_ROBOT_LIMIT;
import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;

/**
 * <p>
 * Automation OpenAPI 控制器
 * </p>
 */
@RestController
@Api(tags = "自动化机器人开放接口")
@ApiResource(path = "/automation/open/triggers")
@Slf4j
public class AutomationOpenApiController {


    @Resource
    private IAutomationRobotService  iAutomationRobotService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private LimitProperties limitProperties;

    @PostResource(name = "创建/更新触发器与机器人", path = "/createOrUpdate", requiredPermission = false)
    @ApiOperation(value = "创建/更新触发器与机器人", notes = "创建/更新触发器与机器人")
    @ApiImplicitParam(name = ParamsConstants.X_SERVICE_TOKEN, value = "服务商认证Token", dataTypeClass = String.class, paramType = "header", example = "asvDsF724qvkLdd83J")
    public ResponseData<AutomationTriggerCreateVo> createOrUpdateTrigger(@RequestBody @Valid AutomationApiTriggerCreateRo data,
                                                                 @RequestHeader(name = ParamsConstants.X_SERVICE_TOKEN,required = false) String xServiceToken ) {

        // todo: 服务商认证Token有效性验证
        if (StrUtil.isEmpty(xServiceToken)){
            return ResponseData.status(false,500,"X-Service-Token 不允许为空").data(null);
        }
        // 判断 是否该用户有管理权限，在该维格表创建机器人
        String spaceId = iNodeService.getSpaceIdByNodeId(data.getRobot().getResourceId());
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getUserSpaceDto(spaceId).getMemberId();
        // 校验节点下是否有指定操作权限
        controlTemplate.checkNodePermission(memberId, data.getRobot().getResourceId(), NodePermission.MANAGE_NODE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        //超过单表机器人数量则不允许创建
        List<AutomationRobotDto> automationRobotDtoList = iAutomationRobotService.getRobotListByResourceId(data.getRobot().getResourceId());
        ExceptionUtil.isFalse(automationRobotDtoList.size() >= limitProperties.getDstRobotMaxCount(),DST_ROBOT_LIMIT);

        return iAutomationRobotService.upsert(data,xServiceToken);
    }

    @PostResource(name = "删除触发器与机器人", path = "/datasheets/{datasheetId}/robots", requiredPermission = false,method = RequestMethod.DELETE)
    @ApiOperation(value = "删除触发器与机器人", notes = "删除触发器与机器人")
    @ApiImplicitParam(name = ParamsConstants.X_SERVICE_TOKEN, value = "服务商认证Token", dataTypeClass = String.class, paramType = "header", example = "asvDsF724qvkLdd83J")
    public ResponseData<String> deleteTrigger(@PathVariable(name = "datasheetId") String datasheetId,
                                              @RequestParam(name = "robotIds") String[] robotIds) {
        // todo: 服务商认证Token有效性验证
        if ( robotIds.length == 0 ) {
            return ResponseData.success("robotIds[] 不能为空");
        }
        // 权限校验
        // 获取空间ID，方法包含判断节点是否存在
        String spaceId = iNodeService.getSpaceIdByNodeId(datasheetId);
        SpaceHolder.set(spaceId);
        // 获取成员ID，方法包含判断用户是否在此空间
        Long memberId = LoginContext.me().getUserSpaceDto(spaceId).getMemberId();
        // 校验节点下是否有指定操作权限
        controlTemplate.checkNodePermission(memberId, datasheetId, NodePermission.MANAGE_NODE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));

        //查询己创建机器人
        List<AutomationRobotDto> automationRobotDtoList =  iAutomationRobotService.getRobotListByResourceId(datasheetId);
        if (automationRobotDtoList == null || automationRobotDtoList.size() == 0 ){
            return ResponseData.success("datasheetId 表无robot");
        }
        List<String> robotList = automationRobotDtoList.stream().map(AutomationRobotDto::getRobotId).collect(Collectors.toList());
        robotList.retainAll(Arrays.asList(robotIds));
        iAutomationRobotService.delete(robotList);
        return ResponseData.success("");
    }

}
