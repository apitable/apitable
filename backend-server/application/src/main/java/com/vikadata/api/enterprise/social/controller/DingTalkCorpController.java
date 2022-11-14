package com.vikadata.api.enterprise.social.controller;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.enterprise.social.service.IDingTalkService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.social.dingtalk.exception.DingTalkApiException;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


/**
 * DingTalk related interface
 */
@RestController
@Api(tags = "DingTalk enterprise internal application related service interface")
@ApiResource(path = "/dingtalkCorp")
@Slf4j
public class DingTalkCorpController {

    @Resource
    private IDingTalkService dingTalkService;

    @PostResource(path = "/login", name = "dingtalk user password free login", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "dingtalk user password free login", notes = "After the login is completed, the system saves the user session by default, and calls other business interfaces to automatically bring the cookie")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "code", value = "temporary authorization code, uploaded by the client", dataTypeClass = String.class, required = true, paramType = "query")
    })
    public ResponseData<DingTalkUserDetail> login(@RequestParam(value = "code") String requestAuthCode) throws DingTalkApiException {
        log.info("DingTalk user login,code:{}", requestAuthCode);
        // query whether there is user login information in the session
        String userId = dingTalkService.getUserInfoV2ByCode(requestAuthCode).getUserid();
        DingTalkUserDetail userInfo = dingTalkService.getUserInfoByUserId(userId);
        // query system users and save them to the session, no need to log in again next time
        if (ObjectUtil.isNotNull(userInfo)) {
            SessionContext.setDingTalkUserId(userId, userInfo.getName());
        }
        return ResponseData.success(userInfo);
    }

}
