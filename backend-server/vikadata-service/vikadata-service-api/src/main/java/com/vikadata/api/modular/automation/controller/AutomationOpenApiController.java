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

@RestController
@Api(tags = "Automation - Open API")
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

    @PostResource(name = "Create/Update trigger and robot", path = "/createOrUpdate", requiredPermission = false)
    @ApiOperation(value = "Create/Update trigger and robot", notes = "Create/Update trigger and robot")
    @ApiImplicitParam(name = ParamsConstants.X_SERVICE_TOKEN, value = "Service Provider Auth Token", dataTypeClass = String.class, paramType = "header", example = "asvDsF724qvkLdd83J")
    public ResponseData<AutomationTriggerCreateVo> createOrUpdateTrigger(@RequestBody @Valid AutomationApiTriggerCreateRo data,
                                                                 @RequestHeader(name = ParamsConstants.X_SERVICE_TOKEN,required = false) String xServiceToken ) {

        // todo: verify Service Provider Auth Token
        if (StrUtil.isEmpty(xServiceToken)){
            return ResponseData.status(false,500,"X-Service-Token no allow null").data(null);
        }
        // Whether the user has management permission.
        String spaceId = iNodeService.getSpaceIdByNodeId(data.getRobot().getResourceId());
        SpaceHolder.set(spaceId);
        // Method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getUserSpaceDto(spaceId).getMemberId();
        // Verify whether the user has the specified node operation permission.
        controlTemplate.checkNodePermission(memberId, data.getRobot().getResourceId(), NodePermission.MANAGE_NODE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        // The robot cannot be created if the number of robots in a datasheet more than limitations.
        List<AutomationRobotDto> automationRobotDtoList = iAutomationRobotService.getRobotListByResourceId(data.getRobot().getResourceId());
        ExceptionUtil.isFalse(automationRobotDtoList.size() >= limitProperties.getDstRobotMaxCount(),DST_ROBOT_LIMIT);

        return iAutomationRobotService.upsert(data,xServiceToken);
    }

    @PostResource(name = "Delete trigger and robot", path = "/datasheets/{datasheetId}/robots", requiredPermission = false,method = RequestMethod.DELETE)
    @ApiOperation(value = "Delete trigger and robot", notes = "Delete trigger and robot")
    @ApiImplicitParam(name = ParamsConstants.X_SERVICE_TOKEN, value = "Service Provider Auth Token", dataTypeClass = String.class, paramType = "header", example = "asvDsF724qvkLdd83J")
    public ResponseData<String> deleteTrigger(@PathVariable(name = "datasheetId") String datasheetId,
                                              @RequestParam(name = "robotIds") String[] robotIds) {
        // todo: verify Service Provider Auth Token
        if ( robotIds.length == 0 ) {
            return ResponseData.success("robotIds[] no allow null");
        }
        // Verify permission.
        // Method includes determining whether the node is in this space.
        String spaceId = iNodeService.getSpaceIdByNodeId(datasheetId);
        SpaceHolder.set(spaceId);
        // Method includes determining whether the user is in this space.
        Long memberId = LoginContext.me().getUserSpaceDto(spaceId).getMemberId();
        // Verify whether the user has the specified node operation permission.
        controlTemplate.checkNodePermission(memberId, datasheetId, NodePermission.MANAGE_NODE,
            status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));

        // Query the existing robots.
        List<AutomationRobotDto> automationRobotDtoList =  iAutomationRobotService.getRobotListByResourceId(datasheetId);
        if (automationRobotDtoList == null || automationRobotDtoList.size() == 0 ){
            return ResponseData.success("Datasheet hasn't robots.");
        }
        List<String> robotList = automationRobotDtoList.stream().map(AutomationRobotDto::getRobotId).collect(Collectors.toList());
        robotList.retainAll(Arrays.asList(robotIds));
        iAutomationRobotService.delete(robotList);
        return ResponseData.success("");
    }

}
