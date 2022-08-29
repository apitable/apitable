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
import static com.vikadata.define.constants.RedisConstants.WECHAT_MINIAPP_AUTH_RESULT;
import static com.vikadata.define.constants.RedisConstants.WECHAT_MINIAPP_CODE_MARK;

/**
 * <p>
 * 微信小程序相关接口
 * </p>
 *
 * @author Benson Cheung
 * @date 2020/02/16 20:12
 */
@RestController
@Api(tags = "微信模块_微信小程序相关服务接口")
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
    @ApiOperation(value = "授权登录(wx.login调用)", notes = "小程序授权登录（静默授权），区别于首页的两种登录方式")
    @ApiImplicitParam(name = "code", value = "wx.login拿到的微信登录凭证", dataTypeClass = String.class, required = true, paramType = "query")
    public ResponseData<LoginResultVo> authorize(@RequestParam(value = "code") String code) {
        log.info("微信用户登录,code:{}", code);
        if (wxMaService == null) {
            throw new BusinessException("未开启微信小程序组件");
        }
        // 先行获取缓存中的信息，避免code重复使用
        BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(StrUtil.format(WECHAT_MINIAPP_AUTH_RESULT, code));
        WxMaJscode2SessionResult result;
        if (ObjectUtil.isNotNull(ops.get())) {
            result = (WxMaJscode2SessionResult) ops.get();
        }
        else {
            // 获取微信用户身份
            try {
                result = wxMaService.jsCode2SessionInfo(code);
                ops.set(result, 2, TimeUnit.HOURS);
            }
            catch (WxErrorException e) {
                e.printStackTrace();
                throw new BusinessException(ILLEGAL_REQUEST);
            }
        }
        // 登录处理，若存在绑定的用户自动进入工作台，否则新增或更新微信会员信息
        LoginResultVo vo = iWechatMaService.login(result);
        return ResponseData.success(vo);
    }

    @GetResource(path = "/phone", requiredLogin = false)
    @ApiOperation(value = "用户授权使用微信手机号", notes = "场景：小程序首页-微信登录；web扫码登录(未绑定维格帐号的微信号)")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "mark", value = "小程序码唯一标识(同意web扫码登录须传)", dataTypeClass = String.class, paramType = "query"),
        @ApiImplicitParam(name = "encryptedData", value = "加密后的数据", dataTypeClass = String.class, required = true, paramType = "query"),
        @ApiImplicitParam(name = "iv", value = "加密算法的初始向量", dataTypeClass = String.class, required = true, paramType = "query")
    })
    public ResponseData<LoginResultVo> phone(@RequestParam(value = "encryptedData", required = false) String encryptedData,
        @RequestParam(value = "iv", required = false) String iv,
        @RequestParam(value = "mark", required = false) String mark) {
        if (wxMaService == null) {
            throw new BusinessException("未开启微信小程序组件");
        }
        ExceptionUtil.isFalse(encryptedData == null || iv == null, NO_ARG);
        // 获取sessionKey
        Long wechatMemberId = SessionContext.getWechatMemberId();
        String sessionKey = thirdPartyMemberMapper.selectSessionKeyById(wechatMemberId);
        // 解密
        WxMaPhoneNumberInfo phoneNoInfo = wxMaService.getUserService().getPhoneNoInfo(sessionKey, encryptedData, iv);
        // 登录处理
        LoginResultVo vo = iWechatMaService.signIn(wechatMemberId, phoneNoInfo);
        //神策埋点 - 注册/登录
        TrackEventType type = vo.isNewUser() ? TrackEventType.REGISTER : TrackEventType.LOGIN;
        ClientOriginInfo origin = InformationUtil.getClientOriginInfo(false, true);
        TaskManager.me().execute(() -> sensorsService.track(vo.getUserId(), type, "微信小程序", origin));
        // 同意web扫码登录处理
        if (StrUtil.isNotBlank(mark)) {
            // 读取小程序码唯一标识缓存
            String key = StrUtil.format(WECHAT_MINIAPP_CODE_MARK, mark);
            BoundValueOperations<String, Object> opts = redisTemplate.boundValueOps(key);
            ExceptionUtil.isNotNull(opts.get(), MA_CODE_INVALID);
            // 将绑定的维格帐号ID放入缓存，让web端轮询到结果实现登录
            Long userId = SessionContext.getUserId();
            opts.set(userId, Objects.requireNonNull(opts.getExpire()) + 5, TimeUnit.SECONDS);
        }
        return ResponseData.success(vo);
    }

    @GetResource(path = "/info", requiredLogin = false)
    @ApiOperation(value = "同步微信的用户信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "signature", value = "签名", dataTypeClass = String.class, required = true, paramType = "query"),
        @ApiImplicitParam(name = "rawData", value = "数据", dataTypeClass = String.class, required = true, paramType = "query"),
        @ApiImplicitParam(name = "encryptedData", value = "加密后的数据", dataTypeClass = String.class, required = true, paramType = "query"),
        @ApiImplicitParam(name = "iv", value = "加密算法的初始向量", dataTypeClass = String.class, required = true, paramType = "query")
    })
    public ResponseData<Void> info(@RequestParam(value = "signature", required = false) String signature,
        @RequestParam(value = "rawData", required = false) String rawData,
        @RequestParam(value = "encryptedData", required = false) String encryptedData,
        @RequestParam(value = "iv", required = false) String iv) {
        if (wxMaService == null) {
            throw new BusinessException("未开启微信小程序组件");
        }
        // 获取sessionKey
        Long wechatMemberId = SessionContext.getWechatMemberId();
        String sessionKey = thirdPartyMemberMapper.selectSessionKeyById(wechatMemberId);
        // 用户信息校验
        if (!wxMaService.getUserService().checkUserInfo(sessionKey, rawData, signature)) {
            throw new BusinessException(USER_CHECK_FAILED);
        }
        // 解密用户信息
        WxMaUserInfo userInfo = wxMaService.getUserService().getUserInfo(sessionKey, encryptedData, iv);
        // 信息处理
        iThirdPartyMemberService.editMiniAppMember(wechatMemberId, null, null, userInfo);
        return ResponseData.success();
    }

    @GetResource(path = "/getInfo", requiredPermission = false)
    @ApiOperation(value = "获取用户信息")
    public ResponseData<WechatInfoVo> getInfo() {
        // 通过微信会员ID实时获取绑定帐号的用户ID，避免会话中的userId已不是绑定帐号
        Long wechatMemberId = SessionContext.getWechatMemberId();
        Long userId = thirdPartyMemberMapper.selectUserIdByIdAndLinkType(wechatMemberId, LinkType.WECHAT.getType());
        WechatInfoVo vo = iWechatMaService.getUserInfo(userId);
        return ResponseData.success(vo);
    }

    @GetResource(path = "/operate", requiredLogin = false)
    @ApiOperation(value = "小程序码页面的操作", notes = "场景：进入时验证小程序码是否有效；确定登录（绑定维格帐号的微信号，未绑定的需用户授权使用微信手机号）；取消登录；确定绑定帐号")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "type", value = "类型(0:进入验证有效性;1:确定登录（绑定维格帐号的微信号）;2:取消登录/绑定帐号;3:确定绑定帐号)", dataTypeClass = Integer.class, required = true, paramType = "query", defaultValue = "0"),
        @ApiImplicitParam(name = "mark", value = "小程序码唯一标识", dataTypeClass = String.class, required = true, paramType = "query")
    })
    public ResponseData<Void> operate(@RequestParam(value = "type", required = false) Integer type,
            @RequestParam(value = "mark", required = false) String mark) {
        ExceptionUtil.isFalse(type == null || mark == null, NO_ARG);
        log.info("扫码后，小程序码页面的操作，mark:{}，type:{}", mark, type);
        // 读取小程序码唯一标识缓存
        String key = StrUtil.format(WECHAT_MINIAPP_CODE_MARK, mark);
        BoundValueOperations<String, Object> opts = redisTemplate.boundValueOps(key);
        Object code = opts.get();
        switch (type) {
            case 0:
                ExceptionUtil.isNotNull(code, MA_CODE_INVALID);
                opts.set(SCAN_SUCCESS.getCode(), Objects.requireNonNull(opts.getExpire()), TimeUnit.SECONDS);
                break;
            case 1:
                log.info("扫码授权登录，mark:{}，缓存取得状态值：{}", mark, code);
                // 确定登录，将绑定的维格帐号ID放入缓存，让web端轮询到结果实现登录
                ExceptionUtil.isNotNull(code, MA_CODE_INVALID);
                Long wechatMemberId = SessionContext.getWechatMemberId();
                Long userId = thirdPartyMemberMapper.selectUserIdByIdAndLinkType(wechatMemberId, LinkType.WECHAT.getType());
                ExceptionUtil.isNotNull(userId, WECHAT_NO_LINK);
                opts.set(userId, Objects.requireNonNull(opts.getExpire()) + 5, TimeUnit.SECONDS);
                break;
            case 2:
                // 若还处于有效时间内，更新小程序端取消登录/绑定的状态
                if (ObjectUtil.isNotNull(code)) {
                    opts.set(CANCEL_OPERATION.getCode(), Objects.requireNonNull(opts.getExpire()), TimeUnit.SECONDS);
                }
                break;
            case 3:
                log.info("绑定帐号，mark:{}，缓存取得状态值：{}", mark, code);
                // 将微信会员ID放入缓存，让web端轮询到结果与帐号建立关联
                wechatMemberId = SessionContext.getWechatMemberId();
                userId = thirdPartyMemberMapper.selectUserIdByIdAndLinkType(wechatMemberId, LinkType.WECHAT.getType());
                if (ObjectUtil.isNotNull(userId)) {
                    // 若微信号已绑定了其他维格帐号，保存结果到缓存让web端也同步提示
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
