package com.vikadata.api.enterprise.wechat.service.impl;

import javax.annotation.Resource;

import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import cn.binarywang.wx.miniapp.bean.WxMaPhoneNumberInfo;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.wx.miniapp.autoconfigure.WxMaProperties;
import com.vikadata.api.shared.cache.bean.LoginUserDto;
import com.vikadata.api.shared.cache.service.LoginUserService;
import com.vikadata.api.shared.cache.service.UserActiveSpaceService;
import com.vikadata.api.shared.config.properties.LimitProperties;
import com.vikadata.api.shared.context.LoginContext;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.user.enums.ThirdPartyMemberType;
import com.vikadata.api.user.dto.WechatMemberDto;
import com.vikadata.api.space.vo.SpaceInfoVO;
import com.vikadata.api.enterprise.wechat.vo.LoginResultVo;
import com.vikadata.api.enterprise.wechat.vo.WechatInfoVo;
import com.vikadata.api.space.service.ISpaceService;
import com.vikadata.api.user.mapper.ThirdPartyMemberMapper;
import com.vikadata.api.user.service.IThirdPartyMemberService;
import com.vikadata.api.user.service.IUserLinkService;
import com.vikadata.api.user.service.IUserService;
import com.vikadata.api.enterprise.wechat.service.IWechatMaService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.user.enums.UserException.MOBILE_HAS_BOUND_WECHAT;

/**
 * <p>
 * WeChat Ma Service Implement Class
 * </p>
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
        log.info("User「{}」 gets login result.", userId);
        SessionContext.setId(userId, wechatMemberId);
        // Query basic user information
        LoginUserDto loginUserDto = LoginContext.me().getLoginUser();
        LoginResultVo vo = LoginResultVo.builder()
                .isBind(true)
                .nickName(loginUserDto.getNickName())
                .build();
        // Get the space ID of the user's most recent work
        String activeSpaceId = userActiveSpaceService.getLastActiveSpace(userId);
        if (StrUtil.isNotBlank(activeSpaceId)) {
            vo.setNeedCreate(false);
        }
        return vo;
    }

    @Override
    public LoginResultVo login(WxMaJscode2SessionResult result) {
        log.info("WeChat applet authorized login. WxMaJsCode2SessionResult:{}", result);
        if (wxMaProperties == null) {
            throw new BusinessException("WeChat applet component is not enabled");
        }
        // Query whether openId has corresponding wx members and bound users
        WechatMemberDto dto = thirdPartyMemberMapper.selectWechatMemberDto(ThirdPartyMemberType.WECHAT_MINIAPP.getType(),
                wxMaProperties.getAppId(), result.getOpenid());
        Long wechatMemberId;
        LoginResultVo vo = new LoginResultVo();
        if (ObjectUtil.isNotNull(dto)) {
            wechatMemberId = dto.getId();
            // Update wx membership session_key
            iThirdPartyMemberService.editMiniAppMember(wechatMemberId, result, null, null);
            // If there is a bound user, save the session and return the required information
            if (ObjectUtil.isNotNull(dto.getUserId())) {
                vo = this.getLoginResult(dto.getUserId(), wechatMemberId);
                vo.setHasUnion(dto.getHasUnion());
                return vo;
            }
            vo.setHasUnion(dto.getHasUnion());
        }
        else {
            wechatMemberId = iThirdPartyMemberService.createMiniAppMember(wxMaProperties.getAppId(), result);
        }
        SessionContext.setId(null, wechatMemberId);
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public LoginResultVo signIn(Long wechatMemberId, WxMaPhoneNumberInfo phoneNoInfo) {
        log.info("Login processing using WeChat mobile phone number. WxMaPhoneNumberInfo:{}", phoneNoInfo);
        if (wxMaProperties == null) {
            throw new BusinessException("WeChat applet component is not enabled");
        }
        // Query the user ID corresponding to the mobile phone number and the associated WeChat member ID
        WechatMemberDto dto = thirdPartyMemberMapper.selectUserLinkedWechatMemberDto(wxMaProperties.getAppId(),
                phoneNoInfo.getPurePhoneNumber());
        Long userId;
        if (ObjectUtil.isNull(dto)) {
            throw new BusinessException("The mobile phone number has not been registered, please go to the PC to register first.");
        }
        else {
            userId = dto.getUserId();
            if (BooleanUtil.isFalse(dto.getHasLink())) {
                // Automatically create associations
                iUserLinkService.create(userId, wechatMemberId);
            }
            else if (ObjectUtil.isNotNull(dto.getId())) {
                // It is not the current WeChat that there is an association,
                // and it prompts to use the mobile phone number to log in
                ExceptionUtil.isTrue(dto.getId().equals(wechatMemberId), MOBILE_HAS_BOUND_WECHAT);
            }
            iUserService.updateLoginTime(userId);
        }
        if (ObjectUtil.isNull(dto) || StrUtil.isBlank(dto.getMobile())) {
            iThirdPartyMemberService.editMiniAppMember(wechatMemberId, null, phoneNoInfo, null);
        }
        LoginResultVo vo = this.getLoginResult(userId, wechatMemberId);
        vo.setNewUser(false);
        vo.setUserId(userId);
        return vo;
    }

    @Override
    public WechatInfoVo getUserInfo(Long userId) {
        log.info("Get user「{}」 information.", userId);
        LoginUserDto loginUserDto = loginUserService.getLoginUser(userId);
        WechatInfoVo vo = WechatInfoVo.builder()
                .nickName(loginUserDto.getNickName())
                .avatar(loginUserDto.getAvatar())
                .mobile(StrUtil.replace(loginUserDto.getMobile(), 3, 7, '*'))
                .email(loginUserDto.getEmail())
                .build();
        // Get the space ID of the user's most recent work
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
