package com.vikadata.api.modular.idaas.controller;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.modular.idaas.service.IIdaasContactService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 玉符 IDaaS 通讯录
 * </p>
 * @author 刘斌华
 * @date 2022-05-16 16:11:58
 */
@Slf4j
@Api(tags = "玉符 IDaaS 通讯录")
@RestController
@ApiResource(path = "/idaas/contact")
public class IdaasContactController {

    @Resource
    private IIdaasContactService idaasContactService;

    @PostResource(path = "/sync")
    @ApiOperation("同步通讯录")
    public ResponseData<Void> postSync() {
        idaasContactService.syncContact(LoginContext.me().getSpaceId(), SessionContext.getUserId());

        return ResponseData.success();
    }

}
