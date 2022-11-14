package com.vikadata.api.user.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.cache.bean.SocialAuthInfo;
import com.vikadata.api.shared.cache.service.UserLinkInfoService;
import com.vikadata.api.user.enums.UserException;
import com.vikadata.api.user.enums.LinkType;
import com.vikadata.api.enterprise.social.service.ISocialUserBindService;
import com.vikadata.api.user.mapper.ThirdPartyMemberMapper;
import com.vikadata.api.user.mapper.UserLinkMapper;
import com.vikadata.api.user.service.IUserLinkService;
import com.vikadata.core.exception.BaseException;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.ThirdPartyMemberEntity;
import com.vikadata.api.user.entity.UserLinkEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.user.enums.UserException.DINGTALK_LINK_OTHER;
import static com.vikadata.api.user.enums.UserException.FEISHU_LINK_OTHER;
import static com.vikadata.api.user.enums.UserException.LINK_FAILURE;
import static com.vikadata.api.user.enums.UserException.MOBILE_HAS_BOUND_DINGTALK;
import static com.vikadata.api.user.enums.UserException.MOBILE_HAS_BOUND_FEISHU;
import static com.vikadata.api.user.enums.UserException.MOBILE_HAS_BOUND_TENCENT;
import static com.vikadata.api.user.enums.UserException.MOBILE_HAS_BOUND_WECHAT;
import static com.vikadata.api.user.enums.UserException.TENCENT_LINK_OTHER;
import static com.vikadata.api.user.enums.UserException.WECHAT_LINK_OTHER;
import static com.vikadata.api.user.enums.LinkType.DINGTALK;
import static com.vikadata.api.user.enums.LinkType.FEISHU;
import static com.vikadata.api.user.enums.LinkType.TENCENT;
import static com.vikadata.api.user.enums.LinkType.WECHAT;

/**
 * <p>
 * Basic - Account Association Table Service Implementation Class
 * </p>
 */
@Slf4j
@Service
public class UserLinkServiceImpl extends ServiceImpl<UserLinkMapper, UserLinkEntity> implements IUserLinkService {

    @Resource
    private UserLinkMapper userLinkMapper;

    @Resource
    private ThirdPartyMemberMapper thirdPartyMemberMapper;

    @Resource
    private UserLinkInfoService userLinkInfoService;

    @Resource
    private ISocialUserBindService iSocialUserBindService;

    @Override
    public void create(Long userId, Long wechatMemberId) {
        log.info("Create Associations");
        ThirdPartyMemberEntity wechatMember = thirdPartyMemberMapper.selectById(wechatMemberId);
        UserLinkEntity entity = UserLinkEntity.builder()
                .userId(userId)
                .openId(wechatMember.getOpenId())
                .unionId(wechatMember.getUnionId())
                .nickName(wechatMember.getNickName())
                .type(WECHAT.getType())
                .build();
        boolean flag = save(entity);
        ExceptionUtil.isTrue(flag, LINK_FAILURE);
        // Delete Cache
        userLinkInfoService.delete(userId);
    }

    @Override
    public void checkThirdPartyLinkOtherUser(String unionId, Integer type) {
        log.info("Check whether the third-party account is associated with other vika accounts");
        Long linkUserId = userLinkMapper.selectUserIdByUnionIdAndType(unionId, type);
        throwEx(type, linkUserId != null, DINGTALK_LINK_OTHER, WECHAT_LINK_OTHER, TENCENT_LINK_OTHER, FEISHU_LINK_OTHER);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createUserLink(Long userId, SocialAuthInfo authInfo, boolean check, Integer type) {
        log.info("Create Third Party Association");
        if (type != FEISHU.getType()) {
            if (check) {
                // Query whether the vika account has been associated with other third-party accounts
                String linkUnionId = userLinkMapper.selectUnionIdByUserIdAndType(userId, type);
                if (authInfo.getUnionId().equals(linkUnionId)) {
                    return;
                }
                throwEx(type, linkUnionId != null, MOBILE_HAS_BOUND_DINGTALK, MOBILE_HAS_BOUND_WECHAT, MOBILE_HAS_BOUND_TENCENT, MOBILE_HAS_BOUND_FEISHU);
                // Check whether the third-party account is associated with other vika accounts
                checkThirdPartyLinkOtherUser(authInfo.getUnionId(), type);
            }
        }
        // Third party platform account bind
        boolean isExist = iSocialUserBindService.isUnionIdBind(userId, authInfo.getUnionId());
        if (!isExist) {
            iSocialUserBindService.create(userId, authInfo.getUnionId());
        }
        // TODO Change during reconstruction
        createThirdPartyLink(userId, authInfo.getOpenId(), authInfo.getUnionId(), authInfo.getNickName(), type);
    }

    @Override
    public void createThirdPartyLink(Long userId, String openId, String unionId, String nickName, int type) {
        UserLinkEntity entity = new UserLinkEntity();
        entity.setUserId(userId);
        entity.setOpenId(openId);
        entity.setUnionId(unionId);
        entity.setNickName(nickName);
        entity.setType(type);
        boolean flag = save(entity);
        ExceptionUtil.isTrue(flag, LINK_FAILURE);
        // Delete Cache
        userLinkInfoService.delete(userId);
    }

    private void throwEx(int type, boolean b, UserException dingtalkLinkOther, UserException wechatLinkOther, UserException tencentLinkOther, UserException feishuLinkOther) {
        if (b) {
            Map<LinkType, BaseException> thxMap = new HashMap<>(4);
            thxMap.put(DINGTALK, dingtalkLinkOther);
            thxMap.put(WECHAT, wechatLinkOther);
            thxMap.put(TENCENT, tencentLinkOther);
            thxMap.put(FEISHU, feishuLinkOther);
            throw new BusinessException(thxMap.get(LinkType.toEnum(type)));
        }
    }

    @Override
    public boolean isUserLink(String unionId, int linkType) {
        return userLinkMapper.selectUserIdByUnionIdAndType(unionId, linkType) != null;
    }

    @Override
    public void deleteBatchByUnionId(List<String> unionIds) {
        userLinkMapper.deleteByUnionIds(unionIds);
    }

    @Override
    public Boolean checkUserLinkExists(Long userId, String unionId, String openId) {
        Long existUserId = userLinkMapper.selectUserIdByUnionIdAndOpenIdAndType(unionId, openId,
                LinkType.DINGTALK);
        return ObjectUtil.equal(userId, existUserId);
    }

    @Override
    public void deleteBatchOpenId(List<String> openIds, int type) {
        userLinkMapper.deleteByOpenIds(openIds, type);
    }

    @Override
    public Long getUserIdByUnionIdAndOpenId(String unionId, String openId, LinkType linkType) {
        return baseMapper.selectUserIdByUnionIdAndOpenIdAndType(unionId, openId, linkType);
    }
}
