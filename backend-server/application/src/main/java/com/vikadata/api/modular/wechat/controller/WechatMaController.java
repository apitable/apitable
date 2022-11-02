package com.vikadata.api.modular.wechat.controller;


import java.util.Objects;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import cn.binarywang.wx.miniapp.bean.WxMaPhoneNumberInfo;
import cn.binarywang.wx.miniapp.bean.WxMaUserInfo;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.action.TrackEventType;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.model.vo.wechat.LoginResultVo;
import com.vikadata.api.model.vo.wechat.WechatInfoVo;
import com.vikadata.api.modular.base.service.SensorsService;
import com.vikadata.api.modular.user.mapper.ThirdPartyMemberMapper;
import com.vikadata.api.modular.user.service.IThirdPartyMemberService;
import com.vikadata.api.modular.wechat.service.IWechatMaService;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.ParameterException.INCORRECT_ARG;
import static com.vikadata.api.enums.exception.ParameterException.NO_ARG;
import static com.vikadata.api.enums.exception.UserException.CANCEL_OPERATION;
import static com.vikadata.api.enums.exception.UserException.MA_CODE_INVALID;
import static com.vikadata.api.enums.exception.UserException.SCAN_SUCCESS;
import static com.vikadata.api.enums.exception.UserException.USER_CHECK_FAILED;
import static com.vikadata.api.enums.exception.UserException.WECHAT_LINK_OTHER;
import static com.vikadata.api.enums.exception.UserException.WECHAT_NO_LINK;
import static com.vikadata.api.enums.exception.WechatException.ILLEGAL_REQUEST;
import static com.vikadata.core.constants.RedisConstants.WECHAT_MINIAPP_AUTH_RESULT;
import static com.vikadata.core.constants.RedisConstants.WECHAT_MINIAPP_CODE_MARK;

/**
 * <p>
 * WeChat MiniApp API
 * </p>
 */
@RestController
@Api(tags = "WeChat MiniApp API")
@ApiResource(path = "/wechat/miniapp")
@Slf4j
public class WechatMaController {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired(required = false)
    private WxMaService wxMaService;

    @Resource
    private IWechatMaService iWechatMaService;

    @Resource
    private IThirdPartyMemberService iThirdPartyMemberService;

    @Resource
    private ThirdPartyMemberMapper thirdPartyMemberMapper;

    @Resource
    private SensorsService sensorsService;

    @GetResource(path = "/authorize", requiredLogin = false)
    @ApiOperation(value = "Authorized Login(wx.login user)", notes = "Mini Program Authorized Login (Silent Authorization)")
    @ApiImplicitParam(name = "code", value = "Wechat login credentials obtained by wx.login", dataTypeClass = String.class, required = true, paramType = "query")
    public ResponseData<LoginResultVo> authorize(@RequestParam(value = "code") String code) {
        log.info("WeChat user login,code:{}", code);
        if (wxMaService == null) {
            throw new BusinessException("WeChat applet component is not enabled.");
        }
        // Get the information in the cache first to avoid code reuse
        BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(StrUtil.format(WECHAT_MINIAPP_AUTH_RESULT, code));
        WxMaJscode2SessionResult result;
        if (ObjectUtil.isNotNull(ops.get())) {
            result = (WxMaJscode2SessionResult) ops.get();
        }
        else {
            // Get WeChat user identity
            try {
                result = wxMaService.jsCode2SessionInfo(code);
                ops.set(result, 2, TimeUnit.HOURS);
            }
            catch (WxErrorException e) {
                e.printStackTrace();
                throw new BusinessException(ILLEGAL_REQUEST);
            }
        }
        // Login processing, if there is a bound user to automatically enter the workbench, otherwise add or update WeChat member information
        LoginResultVo vo = iWechatMaService.login(result);
        return ResponseData.success(vo);
    }

    @GetResource(path = "/phone", requiredLogin = false)
    @ApiOperation(value = "User authorized to use WeChat mobile number")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "mark", value = "mini program code unique identifier", dataTypeClass = String.class, paramType = "query"),
            @ApiImplicitParam(name = "encryptedData", value = "encrypted data", dataTypeClass = String.class, required = true, paramType = "query"),
            @ApiImplicitParam(name = "iv", value = "initial vector for encryption algorithm", dataTypeClass = String.class, required = true, paramType = "query")
    })
    public ResponseData<LoginResultVo> phone(@RequestParam(value = "encryptedData", required = false) String encryptedData,
            @RequestParam(value = "iv", required = false) String iv,
            @RequestParam(value = "mark", required = false) String mark) {
        if (wxMaService == null) {
            throw new BusinessException("WeChat applet component is not enabled");
        }
        ExceptionUtil.isFalse(encryptedData == null || iv == null, NO_ARG);
        // Get sessionKey
        Long wechatMemberId = SessionContext.getWechatMemberId();
        String sessionKey = thirdPartyMemberMapper.selectSessionKeyById(wechatMemberId);
        // decrypt
        WxMaPhoneNumberInfo phoneNoInfo = wxMaService.getUserService().getPhoneNoInfo(sessionKey, encryptedData, iv);
        // Login processing
        LoginResultVo vo = iWechatMaService.signIn(wechatMemberId, phoneNoInfo);
        // Sensors - Register/Login
        TrackEventType type = vo.isNewUser() ? TrackEventType.REGISTER : TrackEventType.LOGIN;
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        TaskManager.me().execute(() -> sensorsService.track(vo.getUserId(), type, "WeChat Applet", origin));
        // Agree to the web scan code login processing
        if (StrUtil.isNotBlank(mark)) {
            // Read the applet code to uniquely identify the cache
            String key = StrUtil.format(WECHAT_MINIAPP_CODE_MARK, mark);
            BoundValueOperations<String, Object> opts = redisTemplate.boundValueOps(key);
            ExceptionUtil.isNotNull(opts.get(), MA_CODE_INVALID);
            // Put the bound Vig account ID into the cache, and let the web side poll the result to log in
            Long userId = SessionContext.getUserId();
            opts.set(userId, Objects.requireNonNull(opts.getExpire()) + 5, TimeUnit.SECONDS);
        }
        return ResponseData.success(vo);
    }

    @GetResource(path = "/info", requiredLogin = false)
    @ApiOperation(value = "Synchronize WeChat User Information")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "signature", value = "signature", dataTypeClass = String.class, required = true, paramType = "query"),
            @ApiImplicitParam(name = "rawData", value = "data", dataTypeClass = String.class, required = true, paramType = "query"),
            @ApiImplicitParam(name = "encryptedData", value = "encrypted data", dataTypeClass = String.class, required = true, paramType = "query"),
            @ApiImplicitParam(name = "iv", value = "initial vector for encryption algorithm", dataTypeClass = String.class, required = true, paramType = "query")
    })
    public ResponseData<Void> info(@RequestParam(value = "signature", required = false) String signature,
            @RequestParam(value = "rawData", required = false) String rawData,
            @RequestParam(value = "encryptedData", required = false) String encryptedData,
            @RequestParam(value = "iv", required = false) String iv) {
        if (wxMaService == null) {
            throw new BusinessException("WeChat applet component is not enabled");
        }
        // Get sessionKey
        Long wechatMemberId = SessionContext.getWechatMemberId();
        String sessionKey = thirdPartyMemberMapper.selectSessionKeyById(wechatMemberId);
        // User information verification
        if (!wxMaService.getUserService().checkUserInfo(sessionKey, rawData, signature)) {
            throw new BusinessException(USER_CHECK_FAILED);
        }
        // Decrypt user information
        WxMaUserInfo userInfo = wxMaService.getUserService().getUserInfo(sessionKey, encryptedData, iv);
        // information processing
        iThirdPartyMemberService.editMiniAppMember(wechatMemberId, null, null, userInfo);
        return ResponseData.success();
    }

    @GetResource(path = "/getInfo", requiredPermission = false)
    @ApiOperation(value = "Get User Information")
    public ResponseData<WechatInfoVo> getInfo() {
        // Obtain the user ID of the bound account in real time through the WeChat member ID,
        // so as to avoid that the userId in the session is no longer the bound account
        Long wechatMemberId = SessionContext.getWechatMemberId();
        Long userId = thirdPartyMemberMapper.selectUserIdByIdAndLinkType(wechatMemberId, LinkType.WECHAT.getType());
        WechatInfoVo vo = iWechatMaService.getUserInfo(userId);
        return ResponseData.success(vo);
    }

    @GetResource(path = "/operate", requiredLogin = false)
    @ApiOperation(value = "The Operation of The Applet Code")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "type", value = "type (0: Enter verification validity; 1: Confirm the login (the WeChat account of the Weige account is bound); 2: Cancel the login/bind the account; 3: Confirm the binding account)", dataTypeClass = Integer.class, required = true, paramType = "query", defaultValue = "0"),
            @ApiImplicitParam(name = "mark", value = "mini program code unique identifier", dataTypeClass = String.class, required = true, paramType = "query")
    })
    public ResponseData<Void> operate(@RequestParam(value = "type", required = false) Integer type,
            @RequestParam(value = "mark", required = false) String mark) {
        ExceptionUtil.isFalse(type == null || mark == null, NO_ARG);
        log.info("After scanning the code, the operation of the applet code page，mark:{},type:{}", mark, type);
        // Read the applet code to uniquely identify the cache
        String key = StrUtil.format(WECHAT_MINIAPP_CODE_MARK, mark);
        BoundValueOperations<String, Object> opts = redisTemplate.boundValueOps(key);
        Object code = opts.get();
        switch (type) {
            case 0:
                ExceptionUtil.isNotNull(code, MA_CODE_INVALID);
                opts.set(SCAN_SUCCESS.getCode(), Objects.requireNonNull(opts.getExpire()), TimeUnit.SECONDS);
                break;
            case 1:
                log.info("Scan code to authorize login，mark:{}. Cache get status value：{}", mark, code);
                // Confirm the login, put the bound Vig account ID into the cache, and let the web side poll the result to realize the login
                ExceptionUtil.isNotNull(code, MA_CODE_INVALID);
                Long wechatMemberId = SessionContext.getWechatMemberId();
                Long userId = thirdPartyMemberMapper.selectUserIdByIdAndLinkType(wechatMemberId, LinkType.WECHAT.getType());
                ExceptionUtil.isNotNull(userId, WECHAT_NO_LINK);
                opts.set(userId, Objects.requireNonNull(opts.getExpire()) + 5, TimeUnit.SECONDS);
                break;
            case 2:
                // If it is still within the valid time, update the status of canceling the login/binding of the applet
                if (ObjectUtil.isNotNull(code)) {
                    opts.set(CANCEL_OPERATION.getCode(), Objects.requireNonNull(opts.getExpire()), TimeUnit.SECONDS);
                }
                break;
            case 3:
                log.info("Bind account，mark:{}. Cache get status value：{}", mark, code);
                // Put the WeChat member ID in the cache, and let the web side poll the results to associate with the account
                wechatMemberId = SessionContext.getWechatMemberId();
                userId = thirdPartyMemberMapper.selectUserIdByIdAndLinkType(wechatMemberId, LinkType.WECHAT.getType());
                if (ObjectUtil.isNotNull(userId)) {
                    // If the WeChat account has been bound to another Weige account,
                    // save the result to the cache so that the web side can also prompt synchronously
                    opts.set(WECHAT_LINK_OTHER.getCode(), Objects.requireNonNull(opts.getExpire()) + 5, TimeUnit.SECONDS);
                    throw new BusinessException(WECHAT_LINK_OTHER);
                }
                opts.set(wechatMemberId, Objects.requireNonNull(opts.getExpire()) + 5, TimeUnit.SECONDS);
                break;
            default:
                throw new BusinessException(INCORRECT_ARG);
        }
        return ResponseData.success();
    }
}
