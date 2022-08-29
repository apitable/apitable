package com.vikadata.api.modular.dingtalk.controller;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.modular.social.service.IDingTalkService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.social.dingtalk.exception.DingTalkApiException;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


/**
 * <p>
 * 钉钉相关接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/26 20:12
 */
@RestController
@Api(tags = "钉钉模块_钉钉企业内部应用相关服务接口")
@ApiResource(path = "/dingtalkCorp")
@Slf4j
public class DingTalkCorpController {

    @Resource
    private IDingTalkService dingTalkService;

    @PostResource(path = "/login", name = "钉钉用户免密登录", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "钉钉用户免密登录", notes = "登录完成后，系统默认保存用户会话，调用其他业务接口自动带上cookie即可")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "code", value = "免登临时授权码，由客户端传上来", dataTypeClass = String.class, required = true, paramType = "query")
    })
    public ResponseData<DingTalkUserDetail> login(@RequestParam(value = "code") String requestAuthCode) throws DingTalkApiException {
        log.info("钉钉用户登录,code:{}", requestAuthCode);
        //查询会话中是否有用户登录信息
        String userId = dingTalkService.getUserInfoV2ByCode(requestAuthCode).getUserid();
        DingTalkUserDetail userInfo = dingTalkService.getUserInfoByUserId(userId);
        //查询系统用户并且保存到会话里，下次无需重新登录
        if (ObjectUtil.isNotNull(userInfo)) {
            SessionContext.setDingTalkUserId(userId, userInfo.getName());
        }
        return ResponseData.success(userInfo);
    }

}
