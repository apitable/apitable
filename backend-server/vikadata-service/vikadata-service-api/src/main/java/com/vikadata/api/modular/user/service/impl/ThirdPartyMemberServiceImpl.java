package com.vikadata.api.modular.user.service.impl;

import javax.annotation.Resource;

import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import cn.binarywang.wx.miniapp.bean.WxMaPhoneNumberInfo;
import cn.binarywang.wx.miniapp.bean.WxMaUserInfo;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.mp.bean.result.WxMpUser;

import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.enums.user.LinkType;
import com.vikadata.api.enums.user.ThirdPartyMemberType;
import com.vikadata.api.modular.user.mapper.ThirdPartyMemberMapper;
import com.vikadata.api.modular.user.mapper.UserLinkMapper;
import com.vikadata.api.modular.user.service.IThirdPartyMemberService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.ThirdPartyMemberEntity;
import com.vikadata.social.qq.model.TencentUserInfo;
import com.vikadata.social.qq.model.WebAppAuthInfo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.UserException.UPDATE_WECHAT_MEMBER_ERROR;

/**
 * <p>
 * 第三方系统-会员信息表 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/8/10
 */
@Slf4j
@Service
public class ThirdPartyMemberServiceImpl implements IThirdPartyMemberService {

    @Resource
    private ThirdPartyMemberMapper thirdPartyMemberMapper;

    @Resource
    private UserLinkMapper userLinkMapper;

    @Override
    public String getUnionIdByCondition(String appId, String openId, Integer type) {
        return thirdPartyMemberMapper.selectUnionIdByOpenIdAndType(appId, openId, type);
    }

    @Override
    public String getNickNameByCondition(String appId, String unionId, Integer type) {
        return thirdPartyMemberMapper.selectNickNameByUnionIdAndType(appId, unionId, type);
    }

    @Override
    public void createMpMember(String appId, WxMpUser wxMpUser) {
        log.info("创建微信公众号会员，wxMpUser：{}", wxMpUser);
        JSONObject extra = JSONUtil.createObj();
        // 微信公众平台用户信息调整后不反悔敏感信息
        // extra.set("sexDesc", wxMpUser.getSexDesc());
        // extra.set("sex", wxMpUser.getSex());
        // extra.set("city", wxMpUser.getCity());
        // extra.set("province", wxMpUser.getProvince());
        // extra.set("country", wxMpUser.getCountry());
        extra.set("language", wxMpUser.getLanguage());
        extra.set("subscribeTime", wxMpUser.getSubscribeTime());
        extra.set("subscribeScene", wxMpUser.getSubscribeScene());
        extra.set("remark", wxMpUser.getRemark());
        extra.set("groupId", wxMpUser.getGroupId());
        extra.set("tagIds", wxMpUser.getTagIds());
        extra.set("qrScene", wxMpUser.getQrScene());
        extra.set("qrSceneStr", wxMpUser.getQrSceneStr());
        ThirdPartyMemberEntity entity = ThirdPartyMemberEntity.builder()
                .appId(appId)
                .type(ThirdPartyMemberType.WECHAT_PUBLIC_ACCOUNT.getType())
                .openId(wxMpUser.getOpenId())
                .unionId(wxMpUser.getUnionId())
                .extra(extra.toString())
                .build();
        boolean flag = SqlHelper.retBool(thirdPartyMemberMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public Long createMiniAppMember(String appId, WxMaJscode2SessionResult result) {
        log.info("创建微信小程序会员，WxMaJscode2SessionResult：{}", result);
        ThirdPartyMemberEntity entity = ThirdPartyMemberEntity.builder()
                .appId(appId)
                .type(ThirdPartyMemberType.WECHAT_MINIAPP.getType())
                .openId(result.getOpenid())
                .unionId(result.getUnionid())
                .sessionKey(result.getSessionKey())
                .build();
        boolean flag = SqlHelper.retBool(thirdPartyMemberMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        return entity.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void editMiniAppMember(Long id, WxMaJscode2SessionResult result, WxMaPhoneNumberInfo phoneNoInfo, WxMaUserInfo userInfo) {
        log.info("更新微信小程序会员信息，id:{}，result:{}，WxMaPhoneNumberInfo:{}，WxMaUserInfo:{}", id, result, phoneNoInfo, userInfo);
        ThirdPartyMemberEntity entity = ThirdPartyMemberEntity.builder()
                .id(id)
                .build();
        if (ObjectUtil.isNotNull(result)) {
            entity.setSessionKey(result.getSessionKey());
            entity.setUnionId(result.getUnionid());
        }
        if (ObjectUtil.isNotNull(phoneNoInfo)) {
            entity.setMobile(phoneNoInfo.getPurePhoneNumber());
            String extra = thirdPartyMemberMapper.selectExtraById(id);
            JSONObject extraJson = JSONUtil.parseObj(extra);
            extraJson.set("countryCode", phoneNoInfo.getCountryCode());
            extraJson.set("phoneNumber", phoneNoInfo.getPhoneNumber());
            entity.setExtra(extraJson.toString());
        }
        if (ObjectUtil.isNotNull(userInfo)) {
            entity.setUnionId(userInfo.getUnionId());
            entity.setNickName(userInfo.getNickName());
            entity.setAvatar(userInfo.getAvatarUrl());
            String extra = thirdPartyMemberMapper.selectExtraById(id);
            JSONObject extraJson = JSONUtil.parseObj(extra);
            extraJson.set("gender", userInfo.getGender());
            extraJson.set("language", userInfo.getLanguage());
            extraJson.set("country", userInfo.getCountry());
            extraJson.set("province", userInfo.getProvince());
            extraJson.set("city", userInfo.getCity());
            entity.setExtra(extraJson.toString());
            // 查询 unionId 是否绑定了维格帐号，是则无需更新原小程序与维格帐号的关联系信息，避免同一个 unionId 出现两条帐号关联记录
            Long linkUserId = userLinkMapper.selectUserIdByUnionIdAndType(userInfo.getUnionId(), LinkType.WECHAT.getType());
            if (linkUserId == null) {
                // 更新帐号关联信息
                userLinkMapper.updateNickNameAndUnionIdByOpenId(userInfo.getNickName(), userInfo.getUnionId(), userInfo.getOpenId(), LinkType.WECHAT.getType());
            }
        }
        boolean flag = SqlHelper.retBool(thirdPartyMemberMapper.updateById(entity));
        ExceptionUtil.isTrue(flag, UPDATE_WECHAT_MEMBER_ERROR);
    }

    @Override
    public void createTencentMember(WebAppAuthInfo authInfo, TencentUserInfo userInfo) {
        log.info("创建 QQ 会员，authInfo:{}，userInfo:{}", authInfo.toString(), userInfo.toString());
        JSONObject extra = JSONUtil.createObj();
        extra.set("gender", userInfo.getGender());
        extra.set("genderType", userInfo.getGenderType());
        extra.set("province", userInfo.getProvince());
        extra.set("city", userInfo.getCity());
        extra.set("year", userInfo.getYear());
        extra.set("constellation", userInfo.getConstellation());
        ThirdPartyMemberEntity entity = ThirdPartyMemberEntity.builder()
                .appId(authInfo.getClientId())
                .type(ThirdPartyMemberType.TENCENT.getType())
                .openId(authInfo.getOpenId())
                .unionId(authInfo.getUnionId())
                .nickName(userInfo.getNickname())
                .avatar(userInfo.getFigureurlQq1())
                .extra(extra.toString())
                .build();
        boolean flag = SqlHelper.retBool(thirdPartyMemberMapper.insert(entity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }
}
