package com.vikadata.api.modular.idaas.controller;

import java.io.IOException;
import java.util.Objects;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.modular.idaas.model.IdaasAuthCallbackRo;
import com.vikadata.api.modular.idaas.model.IdaasAuthLoginVo;
import com.vikadata.api.modular.idaas.model.IdaasBindInfoVo;
import com.vikadata.api.modular.idaas.service.IIdaasAppBindService;
import com.vikadata.api.modular.idaas.service.IIdaasAuthService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.entity.IdaasAppBindEntity;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 玉符 IDaaS 登录授权
 * </p>
 * @author 刘斌华
 * @date 2022-05-16 16:55:49
 */
@Slf4j
@Api(tags = "玉符 IDaaS 登录授权")
@RestController
@ApiResource(path = "/idaas/auth")
public class IdaasAuthController {

    @Resource
    private IIdaasAppBindService idaasAppBindService;

    @Resource
    private IIdaasAuthService idaasAuthService;

    @GetResource(path = "/{spaceId}/bindInfo", requiredLogin = false)
    @ApiOperation("获取空间站绑定的玉符信息")
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
    @ApiOperation("获取前往玉符系统进行登录的链接")
    public ResponseData<IdaasAuthLoginVo> getLogin(@PathVariable("clientId") String clientId) {
        return ResponseData.success(idaasAuthService.idaasLoginUrl(clientId));
    }

    @GetResource(path = "/login/redirect/{clientId}", requiredLogin = false)
    @ApiOperation("跳转前往玉符系统进行自动登录")
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
    @ApiOperation(value = "用户在玉符系统登录后完成后续操作", notes = "仅用于私有化部署")
    public ResponseData<Void> postCallback(@PathVariable("clientId") String clientId,
            @RequestBody IdaasAuthCallbackRo request) {
        idaasAuthService.idaasLoginCallback(clientId, null, request.getCode(), request.getState());

        return ResponseData.success();
    }

    @PostResource(path = "/callback/{clientId}/{spaceId}", requiredLogin = false)
    @ApiOperation(value = "用户在玉符系统登录后完成后续操作", notes = "仅用于 Sass 版")
    public ResponseData<Void> postSpaceCallback(@PathVariable("clientId") String clientId,
            @PathVariable("spaceId") String spaceId,
            @RequestBody IdaasAuthCallbackRo request) {
        idaasAuthService.idaasLoginCallback(clientId, spaceId, request.getCode(), request.getState());

        return ResponseData.success();
    }

}
