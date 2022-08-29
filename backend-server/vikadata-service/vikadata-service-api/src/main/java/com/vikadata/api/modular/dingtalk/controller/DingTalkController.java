package com.vikadata.api.modular.dingtalk.controller;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.cache.bean.SocialAuthInfo;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.api.helper.RedisLockHelper;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.modular.base.service.IAuthService;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.social.service.IDingTalkService;
import com.vikadata.api.modular.user.mapper.UserLinkMapper;
import com.vikadata.api.modular.user.service.IUserLinkService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.social.dingtalk.exception.DingTalkApiException;
import com.vikadata.social.dingtalk.model.UserInfo;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.ParameterException.INCORRECT_ARG;
import static com.vikadata.define.constants.RedisConstants.GENERAL_LOCKED;


/**
 * <p>
 * 钉钉相关接口
 * </p>
 *
 * @author Chambers
 * @date 2020/10/9
 */
@RestController
@Api(tags = "钉钉模块_钉钉相关服务接口")
@ApiResource(path = "/dingtalk")
@Slf4j
public class DingTalkController {

    @Resource
    private IDingTalkService dingTalkService;

    @Resource
    private IAuthService iAuthService;

    @Resource
    private IUserLinkService iUserLinkService;

    @Resource
    private UserLinkMapper userLinkMapper;

    @Resource
    private SensorsService sensorsService;

    @GetResource(path = "/login/callback", requiredLogin = false)
    @ApiOperation(value = "钉钉扫码登陆回调")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "type", value = "类型(0:扫码登录;1:帐号绑定;)", dataTypeClass = Integer.class, paramType = "query", example = "0"),
            @ApiImplicitParam(name = "code", value = "编码。JS获取loginTmpCode，跳转指定连接后重定向返回", dataTypeClass = String.class, required = true, paramType = "query", example = "ABC123"),
            @ApiImplicitParam(name = "state", value = "声明值。用于防止重放攻击", dataTypeClass = String.class, required = true, paramType = "query", example = "STATE")
    })
    public ResponseData<String> callback(@RequestParam(value = "type", required = false, defaultValue = "0") Integer type,
            @RequestParam(name = "code") String code, @RequestParam(name = "state") String state) {
        // 防止重复请求
        RedisLockHelper.me().preventDuplicateRequests(StrUtil.format(GENERAL_LOCKED, "dingtalk:code", code));
        log.info("钉钉扫码登陆回调，type:{},code:{},state:{}", type, code, state);
        UserInfo userInfo;
        // 通过临时授权码获取授权用户的个人信息
        try {
            userInfo = dingTalkService.getUserInfoByCode(code);
        }
        catch (DingTalkApiException e) {
            log.info("通过临时授权码Code获取用户信息失败，code:{},msg:{}", e.getCode(), e.getMessage());
            throw new BusinessException(INCORRECT_ARG);
        }
        // 帐号绑定处理
        if (type == 1) {
            Long userId = SessionContext.getUserId();
            SocialAuthInfo authInfo = new SocialAuthInfo();
            authInfo.setUnionId(userInfo.getUnionid());
            authInfo.setOpenId(userInfo.getOpenid());
            authInfo.setNickName(userInfo.getNick());
            iUserLinkService.createUserLink(userId, authInfo, true, LinkType.DINGTALK.getType());
            return ResponseData.success(null);
        }
        // 查询是否关联了维格账号
        Long linkUserId = userLinkMapper.selectUserIdByUnionIdAndType(userInfo.getUnionid(), LinkType.DINGTALK.getType());
        if (linkUserId == null) {
            // 找不到关联维格帐号时，将信息保存到用户授权的缓存中，在PC 端完善用户信息后完成关联并登陆
            SocialAuthInfo authInfo = new SocialAuthInfo();
            authInfo.setType(LinkType.DINGTALK.getType());
            authInfo.setUnionId(userInfo.getUnionid());
            authInfo.setOpenId(userInfo.getOpenid());
            authInfo.setNickName(userInfo.getNick());
            return ResponseData.success(iAuthService.saveAuthInfoToCache(authInfo));
        }
        // 登录成功，保存session
        SessionContext.setUserId(linkUserId);
        // 神策埋点 - 登录
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        TaskManager.me().execute(() -> sensorsService.track(linkUserId, TrackEventType.LOGIN, "钉钉扫码", origin));
        return ResponseData.success(null);
    }

}
