package com.vikadata.api.modular.wechat.controller;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;
import javax.validation.Valid;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.bean.WxJsapiSignature;
import me.chanjar.weixin.common.bean.oauth2.WxOAuth2AccessToken;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.result.WxMpQrCodeTicket;
import me.chanjar.weixin.mp.bean.result.WxMpUser;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.cache.bean.SocialAuthInfo;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.api.enums.user.ThirdPartyMemberType;
import com.vikadata.api.helper.RedisLockHelper;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.model.ro.wechat.MpSignatureRo;
import com.vikadata.api.model.vo.wechat.QrCodeVo;
import com.vikadata.api.modular.base.service.IAuthService;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.user.mapper.UserLinkMapper;
import com.vikadata.api.modular.user.service.IThirdPartyMemberService;
import com.vikadata.api.modular.user.service.IUserLinkService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.api.util.RandomExtendUtil;
import com.vikadata.boot.autoconfigure.wx.mp.WxMpProperties;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.constants.WechatConstants.MARK_PRE;
import static com.vikadata.api.constants.WechatConstants.TIMEOUT;
import static com.vikadata.api.enums.exception.UserException.NOT_SCANNED;
import static com.vikadata.api.enums.exception.UserException.QR_CODE_GET_ERROR;
import static com.vikadata.api.enums.exception.UserException.QR_CODE_INVALID;
import static com.vikadata.api.enums.exception.UserException.WECHAT_NO_EXIST;
import static com.vikadata.define.constants.RedisConstants.WECHAT_MP_CODE_MARK;
import static com.vikadata.define.constants.RedisConstants.WECHAT_MP_QRCODE_MARK;

/**
 * <p>
 * 微信公众号相关接口
 * </p>
 *
 * @author Chamebrs
 * @date 2020/5/26
 */
@RestController
@Api(tags = "微信模块_微信公众号相关服务接口")
@ApiResource(path = "/wechat/mp")
@Slf4j
public class WechatMpController {

    @Autowired(required = false)
    private WxMpProperties wxMpProperties;

    @Autowired(required = false)
    private WxMpService wxMpService;

    @Resource
    private IUserLinkService iUserLinkService;

    @Resource
    private UserLinkMapper userLinkMapper;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Resource
    private IAuthService iAuthService;

    @Resource
    private IThirdPartyMemberService iThirdPartyMemberService;

    @Resource
    private SensorsService sensorsService;

    @PostResource(path = "/signature", requiredLogin = false)
    @ApiOperation(value = "获取微信签名")
    public ResponseData<WxJsapiSignature> signature(@RequestBody @Valid MpSignatureRo ro) {
        if (wxMpService == null) {
            throw new BusinessException("未开启微信公众号组件");
        }
        try {
            return ResponseData.success(wxMpService.createJsapiSignature(ro.getUrl()));
        }
        catch (WxErrorException e) {
            log.error("微信回调结果异常,异常原因:{}", e.getMessage());
            throw new BusinessException("获取失败");
        }
    }

    @GetResource(path = "/qrcode", requiredLogin = false)
    @ApiOperation(value = "获取/刷新二维码", notes = "场景：扫码登录、帐号绑定")
    public ResponseData<QrCodeVo> qrcode() {
        if (wxMpService == null) {
            throw new BusinessException("未开启微信公众号组件");
        }
        // 生成随机字符串作为二维码的唯一标识
        int length = 12;
        String mark = RandomExtendUtil.randomString(length);
        try {
            // 生成二维码
            WxMpQrCodeTicket qrCodeTicket = wxMpService.getQrcodeService().qrCodeCreateTmpTicket(MARK_PRE + mark, TIMEOUT);
            QrCodeVo vo = QrCodeVo.builder().mark(mark).image(qrCodeTicket.getTicket()).url(qrCodeTicket.getUrl()).build();
            // 将唯一标识保存进缓存
            String key = StrUtil.format(WECHAT_MP_QRCODE_MARK, mark);
            BoundValueOperations<String, Object> opts = redisTemplate.boundValueOps(key);
            ClientOriginInfo origin = InformationUtil.getClientOriginInfo(true, false);
            opts.set(JSONUtil.toJsonStr(origin), TIMEOUT, TimeUnit.SECONDS);
            return ResponseData.success(vo);
        }
        catch (WxErrorException e) {
            log.error("获取微信公众号二维码", e);
            throw new BusinessException(QR_CODE_GET_ERROR);
        }
    }

    @GetResource(path = "/poll", requiredLogin = false)
    @ApiOperation(value = "轮询", notes = "场景：扫码登录、帐号绑定轮询结果")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "type", value = "类型(0:扫码登录;1:帐号绑定;)", dataTypeClass = Integer.class, required = true, paramType = "query", example = "0"),
        @ApiImplicitParam(name = "mark", value = "二维码的唯一标识", dataTypeClass = String.class, required = true, paramType = "query", example = "mark11")
    })
    public ResponseData<String> poll(@RequestParam(value = "type") Integer type, @RequestParam(value = "mark", required = false) String mark) {
        if (wxMpProperties == null) {
            throw new BusinessException("未开启微信公众号组件");
        }
        // 读取二维码唯一标识缓存
        String key = StrUtil.format(WECHAT_MP_QRCODE_MARK, mark);
        BoundValueOperations<String, Object> opts = redisTemplate.boundValueOps(key);
        if (opts.get() == null) {
            throw new BusinessException(QR_CODE_INVALID.getCode(), QR_CODE_INVALID.getMessage());
        }
        String unionId = Objects.requireNonNull(opts.get()).toString();
        if (JSONUtil.isJson(unionId)) {
            throw new BusinessException(NOT_SCANNED.getCode(), NOT_SCANNED.getMessage());
        }
        if (type == 0) {
            // 从缓存取出 unionId，查询绑定的用户ID
            Long linkUserId = userLinkMapper.selectUserIdByUnionIdAndType(unionId, LinkType.WECHAT.getType());
            // 扫码登录
            if (linkUserId == null) {
                // 找不到关联维格帐号时，将 unionId 保存到用户授权的缓存中，在PC 端完善用户信息后完成关联并登陆
                SocialAuthInfo authInfo = new SocialAuthInfo();
                authInfo.setType(LinkType.WECHAT.getType());
                authInfo.setUnionId(unionId);
                return ResponseData.success(iAuthService.saveAuthInfoToCache(authInfo));
            }
            // 登录成功，保存session
            SessionContext.setUserId(linkUserId);
            // 神策埋点 - 登录
            ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
            TaskManager.me().execute(() -> sensorsService.track(linkUserId, TrackEventType.LOGIN, "微信公众号扫码", origin));
        }
        else {
            // 帐号绑定
            Long userId = SessionContext.getUserId();
            String nickName = iThirdPartyMemberService.getNickNameByCondition(wxMpProperties.getAppId(),
                unionId, ThirdPartyMemberType.WECHAT_PUBLIC_ACCOUNT.getType());
            ExceptionUtil.isNotNull(nickName, WECHAT_NO_EXIST);
            SocialAuthInfo authInfo = new SocialAuthInfo();
            authInfo.setUnionId(unionId);
            authInfo.setNickName(nickName);
            iUserLinkService.createUserLink(userId, authInfo, true, LinkType.WECHAT.getType());
        }
        // 删除唯一标识缓存
        redisTemplate.delete(key);
        return ResponseData.success(null);
    }

    @GetResource(path = "/web/callback", requiredLogin = false)
    @ApiOperation(value = "网页授权回调")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "code", value = "编码。JS获取loginTmpCode，跳转指定连接后重定向返回", dataTypeClass = String.class, required = true, paramType = "query", example = "ABC123"),
        @ApiImplicitParam(name = "state", value = "声明值。用于防止重放攻击", dataTypeClass = String.class, required = true, paramType = "query", example = "STATE")
    })
    public ResponseData<String> callback(@RequestParam(name = "code") String code, @RequestParam(name = "state") String state) {
        log.info("网页授权回调，code:{},state:{}", code, state);
        if (wxMpService == null || wxMpProperties == null) {
            throw new BusinessException("未开启微信公众号组件");
        }
        // 防止重复请求
        RedisLockHelper.me().preventDuplicateRequests(StrUtil.format(WECHAT_MP_CODE_MARK, code));
        try {
            // 通过code换取网页授权access_token
            WxOAuth2AccessToken accessToken = wxMpService.getOAuth2Service().getAccessToken(code);
            if (accessToken.getUnionId() == null) {
                throw new BusinessException("请将用户授权的scope参数设置为snsapi_userinfo");
            }
            // 查询是否已保存该会员
            String unionId = iThirdPartyMemberService.getUnionIdByCondition(wxMpProperties.getAppId(),
                accessToken.getOpenId(), ThirdPartyMemberType.WECHAT_PUBLIC_ACCOUNT.getType());
            if (unionId == null) {
                // 拉取用户信息
                WxMpUser wxMpUser = wxMpService.getUserService().userInfo(accessToken.getOpenId());
                // 未关注用户，无法获取 union_id 完成绑定
                if (StrUtil.isBlank(wxMpUser.getUnionId())) {
                    return ResponseData.success(RandomExtendUtil.randomString(12));
                }
                unionId = wxMpUser.getUnionId();
                // 保存
                iThirdPartyMemberService.createMpMember(wxMpProperties.getAppId(), wxMpUser);
            }
            // 查询是否关联了维格账号
            Long linkUserId = userLinkMapper.selectUserIdByUnionIdAndType(unionId, LinkType.WECHAT.getType());
            if (linkUserId == null) {
                SocialAuthInfo authInfo = new SocialAuthInfo();
                authInfo.setType(LinkType.WECHAT.getType());
                authInfo.setUnionId(unionId);
                return ResponseData.success(iAuthService.saveAuthInfoToCache(authInfo));
            }
            // 登录成功，保存session
            SessionContext.setUserId(linkUserId);
            // 神策埋点 - 登录
            ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
            TaskManager.me().execute(() -> sensorsService.track(linkUserId, TrackEventType.LOGIN, "微信网页授权", origin));
            return ResponseData.success(null);
        }
        catch (WxErrorException e) {
            log.error("网页授权回调失败,异常原因:{}", e.getMessage());
            throw new BusinessException("网页授权回调失败");
        }
    }
}
