package com.vikadata.api.enterprise.idaas.controller;

import java.io.IOException;
import java.util.Objects;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.enterprise.idaas.service.IIdaasAppBindService;
import com.vikadata.api.enterprise.idaas.service.IIdaasAuthService;
import com.vikadata.api.enterprise.idaas.model.IdaasAuthCallbackRo;
import com.vikadata.api.enterprise.idaas.model.IdaasAuthLoginVo;
import com.vikadata.api.enterprise.idaas.model.IdaasBindInfoVo;
import com.vikadata.core.support.ResponseData;
import com.vikadata.entity.IdaasAppBindEntity;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * IDaaS Login authorization
 * </p>
 */
@Slf4j
@Api(tags = "IDaaS Login authorization")
@RestController
@ApiResource(path = "/idaas/auth")
public class IdaasAuthController {

    @Resource
    private IIdaasAppBindService idaasAppBindService;

    @Resource
    private IIdaasAuthService idaasAuthService;

    @GetResource(path = "/{spaceId}/bindInfo", requiredLogin = false)
    @ApiOperation("Get the IDaaS information bound to the space")
    public ResponseData<IdaasBindInfoVo> getBindInfo(@PathVariable("spaceId") String spaceId) {
        IdaasBindInfoVo idaasBindInfoVo = new IdaasBindInfoVo();
        IdaasAppBindEntity appBindEntity = idaasAppBindService.getBySpaceId(spaceId);
        if (Objects.isNull(appBindEntity)) {
            idaasBindInfoVo.setEnabled(false);
        } else {
            idaasBindInfoVo.setEnabled(true);
            idaasBindInfoVo.setClientId(appBindEntity.getClientId());
        }

        return ResponseData.success(idaasBindInfoVo);
    }

    @GetResource(path = "/login/{clientId}", requiredLogin = false)
    @ApiOperation("Get the link to log in to the IDaaS system")
    public ResponseData<IdaasAuthLoginVo> getLogin(@PathVariable("clientId") String clientId) {
        return ResponseData.success(idaasAuthService.idaasLoginUrl(clientId));
    }

    @GetResource(path = "/login/redirect/{clientId}", requiredLogin = false)
    @ApiOperation("Jump to the IDaaS system for automatic login")
    public void getLoginRedirect(@PathVariable("clientId") String clientId,
            HttpServletResponse response) {
        IdaasAuthLoginVo idaasAuthLoginVo = idaasAuthService.idaasLoginUrl(clientId);

        try {
            response.sendRedirect(idaasAuthLoginVo.getLoginUrl());
        }
        catch (IOException ex) {
            log.warn("Failed to send redirect.", ex);
        }
    }

    @PostResource(path = "/callback/{clientId}", requiredLogin = false)
    @ApiOperation(value = "The user completes subsequent operations after logging in to the IDaaS system", notes = "For private deployment only")
    public ResponseData<Void> postCallback(@PathVariable("clientId") String clientId,
            @RequestBody IdaasAuthCallbackRo request) {
        idaasAuthService.idaasLoginCallback(clientId, null, request.getCode(), request.getState());

        return ResponseData.success();
    }

    @PostResource(path = "/callback/{clientId}/{spaceId}", requiredLogin = false)
    @ApiOperation(value = "The user completes subsequent operations after logging in to the IDaaS system", notes = "For Sass version only")
    public ResponseData<Void> postSpaceCallback(@PathVariable("clientId") String clientId,
            @PathVariable("spaceId") String spaceId,
            @RequestBody IdaasAuthCallbackRo request) {
        idaasAuthService.idaasLoginCallback(clientId, spaceId, request.getCode(), request.getState());

        return ResponseData.success();
    }

}
