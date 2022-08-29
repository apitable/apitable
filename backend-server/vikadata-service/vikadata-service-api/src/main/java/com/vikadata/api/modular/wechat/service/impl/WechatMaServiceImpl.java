package com.vikadata.api.modular.wechat.service.impl;

import javax.annotation.Resource;

import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import cn.binarywang.wx.miniapp.bean.WxMaPhoneNumberInfo;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.bean.LoginUserDto;
import com.vikadata.api.cache.service.LoginUserService;
import com.vikadata.api.cache.service.UserActiveSpaceService;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.user.ThirdPartyMemberType;
import com.vikadata.api.model.dto.wechat.WechatMemberDto;
import com.vikadata.api.model.vo.space.SpaceInfoVO;
import com.vikadata.api.model.vo.wechat.LoginResultVo;
import com.vikadata.api.model.vo.wechat.WechatInfoVo;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.mapper.ThirdPartyMemberMapper;
import com.vikadata.api.modular.user.service.IThirdPartyMemberService;
import com.vikadata.api.modular.user.service.IUserLinkService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.wechat.service.IWechatMaService;
import com.vikadata.boot.autoconfigure.wx.miniapp.WxMaProperties;
import com.vikadata.api.config.properties.LimitProperties;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.UserException.MOBILE_HAS_BOUND_WECHAT;

/**
 * <p>
 * 微信小程序 服务实现类
 * </p>
 *
 * @author Chambers
 * @since 2020-02-22
 */
@Slf4j
@Service
public class WechatMaServiceImpl implements IWechatMaService {

    @Resource
    private UserActiveSpaceService userActiveSpaceService;

    @Resource
    private IUserService iUserService;

    @Resource
    private IUserLinkService iUserLinkService;

    @Resource
    private IThirdPartyMemberService iThirdPartyMemberService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private ThirdPartyMemberMapper thirdPartyMemberMapper;

    @Resource
    private LoginUserService loginUserService;

    @Autowired(required = false)
    private WxMaProperties wxMaProperties;

    @Resource
    private LimitProperties limitProperties;

    @Override
    public LoginResultVo getLoginResult(Long userId, Long wechatMemberId) {
        log.info("获取登陆结果");
        // 保存session
        SessionContext.setId(userId, wechatMemberId);
        // 查询用户基本信息
        LoginUserDto loginUserDto = LoginContext.me().getLoginUser();
        LoginResultVo vo = LoginResultVo.builder()
            .isBind(true)
            .nickName(loginUserDto.getNickName())
            .build();
        // 获取用户最近工作的空间ID
        String activeSpaceId = userActiveSpaceService.getLastActiveSpace(userId);
        if (StrUtil.isNotBlank(activeSpaceId)) {
            vo.setNeedCreate(false);
        }
        return vo;
    }

    @Override
    public LoginResultVo login(WxMaJscode2SessionResult result) {
        log.info("微信小程序授权登录，WxMaJsCode2SessionResult:{}", result);
        // 查询openId 是否有对应的微信会员，及绑定的用户
        if (wxMaProperties == null) {
            throw new BusinessException("未开启微信小程序组件");
        }
        WechatMemberDto dto = thirdPartyMemberMapper.selectWechatMemberDto(ThirdPartyMemberType.WECHAT_MINIAPP.getType(),
            wxMaProperties.getAppId(), result.getOpenid());
        Long wechatMemberId;
        LoginResultVo vo = new LoginResultVo();
        if (ObjectUtil.isNotNull(dto)) {
            wechatMemberId = dto.getId();
            // 更新微信会员session_key
            iThirdPartyMemberService.editMiniAppMember(wechatMemberId, result, null, null);
            if (ObjectUtil.isNotNull(dto.getUserId())) {
                // 存在绑定的用户，保存会话，返回需要的信息
                vo = this.getLoginResult(dto.getUserId(), wechatMemberId);
                vo.setHasUnion(dto.getHasUnion());
                return vo;
            }
            vo.setHasUnion(dto.getHasUnion());
        }
        else {
            // 创建微信会员
            wechatMemberId = iThirdPartyMemberService.createMiniAppMember(wxMaProperties.getAppId(), result);
        }
        // 保存微信会员ID到Session
        SessionContext.setId(null, wechatMemberId);
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public LoginResultVo signIn(Long wechatMemberId, WxMaPhoneNumberInfo phoneNoInfo) {
        log.info("使用微信手机号的登录处理，WxMaPhoneNumberInfo:{}", phoneNoInfo);
        if (wxMaProperties == null) {
            throw new BusinessException("未开启微信小程序组件");
        }
        // 查询手机号对应的用户ID及关联的微信成员ID
        WechatMemberDto dto = thirdPartyMemberMapper.selectUserLinkedWechatMemberDto(wxMaProperties.getAppId(),
            phoneNoInfo.getPurePhoneNumber());
        Long userId;
        if (ObjectUtil.isNull(dto)) {
            // v0.5 注册加入邀请码，暂时关闭小程序注册
            throw new BusinessException("手机号尚未注册，请先前往PC端注册");
        }
        else {
            userId = dto.getUserId();
            if (BooleanUtil.isFalse(dto.getHasLink())) {
                // 与当前微信关联
                iUserLinkService.create(userId, wechatMemberId);
            }
            else if (ObjectUtil.isNotNull(dto.getId())) {
                // 存在关联的微信，若不是当前微信，提示使用手机号进行登录
                ExceptionUtil.isTrue(dto.getId().equals(wechatMemberId), MOBILE_HAS_BOUND_WECHAT);
            }
            // 更新最后登陆时间
            iUserService.updateLoginTime(userId);
        }
        if (ObjectUtil.isNull(dto) || StrUtil.isBlank(dto.getMobile())) {
            // 更新微信会员手机信息
            iThirdPartyMemberService.editMiniAppMember(wechatMemberId, null, phoneNoInfo, null);
        }
        LoginResultVo vo = this.getLoginResult(userId, wechatMemberId);
        vo.setNewUser(false);
        vo.setUserId(userId);
        return vo;
    }

    @Override
    public WechatInfoVo getUserInfo(Long userId) {
        log.info("获取用户信息");
        // 查询用户基本信息
        LoginUserDto loginUserDto = loginUserService.getLoginUser(userId);
        WechatInfoVo vo = WechatInfoVo.builder()
            .nickName(loginUserDto.getNickName())
            .avatar(loginUserDto.getAvatar())
            .mobile(StrUtil.replace(loginUserDto.getMobile(), 3, 7, '*'))
            .email(loginUserDto.getEmail())
            .build();
        // 获取用户最近工作的空间ID
        String activeSpaceId = userActiveSpaceService.getLastActiveSpace(loginUserDto.getUserId());
        if (StrUtil.isNotBlank(activeSpaceId)) {
            SpaceInfoVO spaceInfo = iSpaceService.getSpaceInfo(activeSpaceId);
            vo.setSpaceName(spaceInfo.getSpaceName());
            vo.setSpaceLogo(spaceInfo.getSpaceLogo());
            vo.setCreatorName(spaceInfo.getCreatorName());
            vo.setOwnerName(spaceInfo.getOwnerName());
            vo.setCreateTime(spaceInfo.getCreateTime());
            vo.setMemberNumber(spaceInfo.getSeats());
            vo.setTeamNumber(spaceInfo.getDeptNumber());
            vo.setFileNumber(spaceInfo.getSheetNums());
            vo.setRecordNumber(spaceInfo.getRecordNums());
            vo.setUsedSpace(spaceInfo.getCapacityUsedSizes());
            vo.setMaxMemory(limitProperties.getSpaceMemoryMaxSize());
        }
        return vo;
    }
}
