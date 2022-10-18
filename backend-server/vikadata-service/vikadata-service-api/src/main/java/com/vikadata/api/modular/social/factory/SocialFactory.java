package com.vikadata.api.modular.social.factory;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import me.chanjar.weixin.cp.bean.WxCpUser;

import com.vikadata.api.enums.finance.OrderType;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.enums.space.UserSpaceStatus;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.enums.SocialNameModified;
import com.vikadata.api.modular.social.model.DingTalkContactDTO.DingTalkDepartmentDTO;
import com.vikadata.api.modular.social.model.DingTalkContactDTO.DingTalkUserDTO;
import com.vikadata.api.modular.social.model.TenantBaseInfoDto;
import com.vikadata.api.modular.social.model.WeComDepartTree;
import com.vikadata.api.util.RandomExtendUtil;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialCpTenantUserEntity;
import com.vikadata.entity.SocialTenantDepartmentBindEntity;
import com.vikadata.entity.SocialTenantDepartmentEntity;
import com.vikadata.entity.SocialTenantUserEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.TeamMemberRelEntity;
import com.vikadata.social.dingtalk.event.sync.http.OrgSuiteAuthEvent;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse.DingTalkAgentApp;
import com.vikadata.social.feishu.event.UserInfo;
import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;
import com.vikadata.social.feishu.model.v3.UserStatus;
import com.vikadata.social.wecom.event.order.WeComOrderPaidEvent;
import com.vikadata.social.wecom.model.WxCpIsvAuthInfo.EditionInfo;
import com.vikadata.social.wecom.model.WxCpIsvAuthInfo.EditionInfo.Agent;
import com.vikadata.social.wecom.model.WxCpIsvGetOrder;

import static com.vikadata.api.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;
import static com.vikadata.social.feishu.constants.FeishuConstants.FEISHU_ROOT_DEPT_ID;

/**
 * 创建工厂
 *
 * @author Shawn Deng
 * @date 2020-12-18 22:38:36
 */
public class SocialFactory {

    public static <T extends DingTalkDepartmentDTO> SocialTenantDepartmentEntity createDingTalkDepartment(String spaceId,
            String tenantKey, T departmentInfo) {
        SocialTenantDepartmentEntity tenantDepartment = new SocialTenantDepartmentEntity();
        tenantDepartment.setId(IdWorker.getId());
        tenantDepartment.setTenantId(tenantKey);
        tenantDepartment.setSpaceId(spaceId);
        tenantDepartment.setDepartmentId(departmentInfo.getDeptId().toString());
        tenantDepartment.setOpenDepartmentId(departmentInfo.getDeptId().toString());
        tenantDepartment.setParentId(departmentInfo.getParentDeptId().toString());
        tenantDepartment.setParentOpenDepartmentId(departmentInfo.getParentDeptId().toString());
        tenantDepartment.setDepartmentName(departmentInfo.getDeptName());
        return tenantDepartment;
    }

    /**
     *  企业微信租户 - 部门管理创建工厂
     *
     * @param spaceId           空间站Id
     * @param tenantKey         租户Id
     * @param departmentInfo    企业微信部门信息
     */
    public static <T extends WeComDepartTree> SocialTenantDepartmentEntity createWeComTenantDepartment(String spaceId, String tenantKey, T departmentInfo) {
        return new SocialTenantDepartmentEntity()
                .setId(IdWorker.getId())
                .setTenantId(tenantKey)
                .setSpaceId(spaceId)
                .setDepartmentId(departmentInfo.getId())
                .setOpenDepartmentId(departmentInfo.getId())
                .setParentOpenDepartmentId(departmentInfo.getParentId())
                .setDepartmentName(departmentInfo.getName());
    }

    /**
     *  企业微信租户 - 成员管理创建工厂
     *
     * @param tenantKey 企业Id
     * @param appId     企业应用Id
     * @param cpUserId  企业成员UserId
     */
    public static SocialCpTenantUserEntity createWeComTenantUser(String tenantKey, String appId, String cpUserId) {
        return new SocialCpTenantUserEntity()
                .setId(IdWorker.getId())
                .setTenantId(tenantKey)
                .setAppId(appId)
                .setCpUserId(cpUserId);
    }

    public static String createDingTalkAuthInfo(DingTalkServerAuthInfoResponse serverAuthInfo, String agentId,
            String callbackUrl, List<String> registerEvents) {
        Map<String, Object> scope = new HashMap<>(3);
        // 授权方管理员信息
        if (serverAuthInfo.getAuthUserInfo() != null) {
            Map<String, String> authUser = new HashMap<>(2);
            authUser.put("userId", serverAuthInfo.getAuthUserInfo().getUserId());
            scope.put("authUserInfo", authUser);
        }
        // 授权企业信息
        if (serverAuthInfo.getAuthCorpInfo() != null) {
            Map<String, String> tenantInfo = new HashMap<>(4);
            tenantInfo.put("tenantName", serverAuthInfo.getAuthCorpInfo().getCorpName());
            tenantInfo.put("tenantId", serverAuthInfo.getAuthCorpInfo().getCorpid());
            tenantInfo.put("industry", serverAuthInfo.getAuthCorpInfo().getIndustry());
            tenantInfo.put("tenantLogoUrl", serverAuthInfo.getAuthCorpInfo().getCorpLogoUrl());
            scope.put("authTenantInfo", tenantInfo);
        }
        // 授权应用信息
        if (serverAuthInfo.getAuthInfo() != null) {
            Map<Long, DingTalkAgentApp> agentAppMap = serverAuthInfo.getAuthInfo().getAgent().
                    stream().collect(Collectors.toMap(DingTalkAgentApp::getAgentid, a -> a, (k1, k2) -> k1));
            DingTalkAgentApp agentApp = agentAppMap.get(Long.parseLong(agentId));
            Map<String, Object> appAuthInfo = new HashMap<>(5);
            appAuthInfo.put("callbackUrl", callbackUrl);
            appAuthInfo.put("registerEvents", registerEvents);
            appAuthInfo.put("agentId", agentId);
            appAuthInfo.put("appName", agentApp.getAgentName());
            appAuthInfo.put("logoUrl", agentApp.getLogoUrl());
            scope.put("appAuthInfo", appAuthInfo);
        }
        return JSONUtil.toJsonStr(scope);
    }

    public static MemberEntity createDingTalkMember(DingTalkUserDTO userDetail) {
        MemberEntity member = new MemberEntity();
        member.setMemberName(userDetail.getName());
        // 空间内的成员名称不同步用户名称
        member.setNameModified(true);
        member.setOpenId(userDetail.getOpenId());
        member.setMobile(userDetail.getMobile());
        member.setPosition(userDetail.getPosition());
        member.setEmail(userDetail.getEmail());
        return member;
    }

    /**
     * 根据企业微信成员，创建信息的Member并且绑定到空间
     *
     * @param spaceId   空间站Id
     * @param wxCpUser  企业微信成员
     */
    public static MemberEntity createWeComMemberAndBindSpace(String spaceId, WxCpUser wxCpUser) {
        return new MemberEntity()
                .setId(IdWorker.getId())
                .setMemberName(wxCpUser.getName())
                .setOpenId(wxCpUser.getUserId())
                .setSpaceId(spaceId)
                // 空间内的成员名称不同步用户名称
                .setNameModified(true)
                .setIsSocialNameModified(SocialNameModified.NO_SOCIAL.getValue())
                .setIsActive(false)
                .setIsPoint(true)
                .setStatus(UserSpaceStatus.INACTIVE.getStatus());
    }

    /**
     * 创建第三方绑定空间站的信息
     *
     * @param spaceId  空间站Id
     * @param spaceName  空间名称
     * @param spaceLogo 空间站logo
     * @param creator 创建者
     * @param owner 空间站主管理员
     * @author zoe zheng
     * @date 2021/9/13 7:25 下午
     */
    public static SpaceEntity createSocialBindBindSpaceInfo(String spaceId, String spaceName,
            String spaceLogo, Long creator, Long owner) {
        String props = JSONUtil.parseObj(SpaceGlobalFeature.builder().nodeExportable(true)
                .invitable(false).joinable(false).mobileShowable(false).build()).toString();
        return SpaceEntity.builder()
                .spaceId(spaceId)
                .name(spaceName)
                .logo(spaceLogo)
                .props(props)
                .creator(creator)
                .owner(owner)
                .build();
    }

    public static TenantBaseInfoDto getTenantBaseInfoFromAuthInfo(String authInfo, SocialAppType appType,
            SocialPlatformType platformType) {
        Object authInfoObj = JSONUtil.parseObj(authInfo);
        TenantBaseInfoDto dto = new TenantBaseInfoDto();
        if (platformType.equals(SocialPlatformType.DINGTALK)) {
            // 钉钉第三方应用
            if (appType.equals(SocialAppType.ISV)) {
                OrgSuiteAuthEvent event = BeanUtil.toBean(authInfoObj, OrgSuiteAuthEvent.class);
                dto.setTenantKey(event.getAuthCorpInfo().getCorpid());
                dto.setTenantName(event.getAuthCorpInfo().getCorpName());
                dto.setAvatar(event.getAuthCorpInfo().getCorpLogoUrl());
                return dto;
            }
        }
        return dto;
    }

    public static MemberEntity createFeishuMember(Long memberId, String spaceId, String memberName, String mobile, String email, String position, String openId, boolean isAdmin) {
        MemberEntity member = new MemberEntity();
        member.setId(memberId);
        member.setSpaceId(spaceId);
        member.setMemberName(memberName);
        member.setMobile(StrUtil.subSuf(mobile, 3));
        member.setEmail(email);
        member.setPosition(position);
        member.setOpenId(openId);
        member.setIsAdmin(isAdmin);
        member.setIsActive(false);
        member.setIsPoint(true);
        member.setNameModified(true);
        member.setIsSocialNameModified(SocialNameModified.NO_SOCIAL.getValue());
        member.setStatus(UserSpaceStatus.ACTIVE.getStatus());
        return member;
    }

    public static SocialTenantDepartmentEntity createFeishuTenantDepartment(String tenantKey, String spaceId, FeishuDeptObject deptObject) {
        // 创建租户部门记录
        SocialTenantDepartmentEntity tenantDepartment = new SocialTenantDepartmentEntity();
        tenantDepartment.setId(IdWorker.getId());
        tenantDepartment.setSpaceId(spaceId);
        tenantDepartment.setTenantId(tenantKey);
        tenantDepartment.setDepartmentId(deptObject.getDepartmentId());
        tenantDepartment.setOpenDepartmentId(deptObject.getOpenDepartmentId());
        tenantDepartment.setParentId(deptObject.getParentDepartmentId());
        tenantDepartment.setDepartmentName(deptObject.getName());
        tenantDepartment.setDepartmentOrder(Integer.parseInt(deptObject.getOrder()));
        return tenantDepartment;
    }

    public static SocialTenantDepartmentBindEntity createTenantDepartmentBind(String spaceId, Long teamId, String tenantKey, String tenantDepartmentId) {
        SocialTenantDepartmentBindEntity departmentBind = new SocialTenantDepartmentBindEntity();
        departmentBind.setId(IdWorker.getId());
        departmentBind.setSpaceId(spaceId);
        departmentBind.setTeamId(teamId);
        departmentBind.setTenantId(tenantKey);
        departmentBind.setTenantDepartmentId(tenantDepartmentId);
        return departmentBind;
    }

    public static SocialTenantDepartmentBindEntity createTenantDepartmentBind(String spaceId, Long teamId, String tenantKey, String tenantDepartmentId, String tenantOpenDepartmentId) {
        SocialTenantDepartmentBindEntity departmentBind = new SocialTenantDepartmentBindEntity();
        departmentBind.setId(IdWorker.getId());
        departmentBind.setSpaceId(spaceId);
        departmentBind.setTeamId(teamId);
        departmentBind.setTenantId(tenantKey);
        departmentBind.setTenantDepartmentId(tenantDepartmentId);
        departmentBind.setTenantOpenDepartmentId(tenantOpenDepartmentId);
        return departmentBind;
    }

    public static TeamMemberRelEntity createFeishuTeamMemberRel(Long teamId, Long memberId) {
        TeamMemberRelEntity teamMemberRel = new TeamMemberRelEntity();
        teamMemberRel.setId(IdWorker.getId());
        teamMemberRel.setMemberId(memberId);
        teamMemberRel.setTeamId(teamId);
        return teamMemberRel;
    }

    public static SocialTenantUserEntity createTenantUser(String appId, String tenantKey, String openId, String unionId) {
        SocialTenantUserEntity tenantUser = new SocialTenantUserEntity();
        tenantUser.setId(IdWorker.getId());
        tenantUser.setAppId(appId);
        tenantUser.setTenantId(tenantKey);
        tenantUser.setOpenId(openId);
        tenantUser.setUnionId(unionId);
        return tenantUser;
    }

    /**
     * 创建飞书灰度测试兼容成员信息
     *
     * @param userInfo 飞书用户信息
     * @return FeishuUserObject
     * @author zoe zheng
     * @date 2022/3/10 18:48
     */
    public static FeishuUserObject createDefaultLarkUser(UserInfo userInfo) {
        FeishuUserObject user = new FeishuUserObject();
        String openId = IdWorker.getIdStr();
        String unionId = IdWorker.getIdStr();
        if (userInfo != null) {
            if (StrUtil.isNotBlank(userInfo.getOpenId())) {
                openId = userInfo.getOpenId();
            }
            if (StrUtil.isNotBlank(userInfo.getUnionId())) {
                unionId = userInfo.getUnionId();
            }
        }
        user.setOpenId(openId);
        user.setUnionId(unionId);
        user.setName(StrUtil.format("星球居民{}", RandomExtendUtil.randomString(4)));
        user.setEnName(StrUtil.format("{}", RandomExtendUtil.randomString(4)));
        user.setAvatar(null);
        UserStatus status = new UserStatus();
        status.setActivated(true);
        status.setResigned(false);
        user.setStatus(status);
        user.setDepartmentIds(Collections.singletonList(FEISHU_ROOT_DEPT_ID));
        return user;
    }

    /**
     * 获取企微订单生效的月数
     *
     * @param orderPeriod 购买的时长
     * @return 订单生效的月数
     * @author 刘斌华
     * @date 2022-05-07 16:39:35
     */
    public static Integer getWeComOrderMonth(Integer orderPeriod) {
        if (Objects.isNull(orderPeriod)) {
            return null;
        }
        // 企微返回的购买时长以天为单位，365 天为 1 年，不足一年的按一年算
        int rest = orderPeriod % 365;
        return (orderPeriod / 365 + (rest == 0 ? 0 : 1)) * 12;
    }

    /**
     * Convert wecom order type to vika order type
     *
     * @param weComOrderType Wecom order type。0: new order; 1: expand volume; 2: renew period; 3: change edition
     * @return Vika order type
     * @author Codeman
     * @date 2022-05-05 17:04:17
     */
    public static OrderType getOrderTypeFromWeCom(Integer weComOrderType) {
        switch (weComOrderType) {
            case 0:
                return OrderType.BUY;
            case 1:
            case 3:
                return OrderType.UPGRADE;
            case 2:
                return OrderType.RENEW;
            default:
                throw new IllegalArgumentException("Unsupported wecom orderType: " + weComOrderType);
        }
    }

    public static WeComOrderPaidEvent formatOrderPaidEventFromWecomOrder(WxCpIsvGetOrder order) {
        // 复制数据
        WeComOrderPaidEvent paidEvent = new WeComOrderPaidEvent();
        paidEvent.setSuiteId(order.getSuiteId());
        paidEvent.setPaidCorpId(order.getPaidCorpId());
        paidEvent.setOrderId(order.getOrderId());
        paidEvent.setOrderStatus(order.getOrderStatus());
        paidEvent.setOrderType(order.getOrderType());
        paidEvent.setOperatorId(order.getOperatorId());
        paidEvent.setEditionId(order.getEditionId());
        paidEvent.setEditionName(order.getEditionName());
        paidEvent.setPrice(order.getPrice());
        paidEvent.setUserCount(order.getUserCount());
        paidEvent.setOrderPeriod(order.getOrderPeriod());
        paidEvent.setOrderTime(order.getOrderTime());
        paidEvent.setPaidTime(order.getPaidTime());
        paidEvent.setBeginTime(order.getBeginTime());
        paidEvent.setEndTime(order.getEndTime());
        paidEvent.setOrderFrom(order.getOrderFrom());
        paidEvent.setOperatorCorpId(order.getOperatorCorpId());
        paidEvent.setServiceShareAmount(order.getServiceShareAmount());
        paidEvent.setPlatformShareAmount(order.getPlatformShareAmount());
        paidEvent.setDealerShareAmount(order.getDealerShareAmount());
        paidEvent.setDealerCorpInfo(Optional.ofNullable(order.getDealerCorpInfo())
                .map(dealer -> {
                    WeComOrderPaidEvent.DealerCorpInfo dealerCorpInfo = new WeComOrderPaidEvent.DealerCorpInfo();
                    dealerCorpInfo.setCorpId(dealer.getCorpId());
                    dealerCorpInfo.setCorpName(dealer.getCorpName());
                    return dealerCorpInfo;
                }).orElse(null));
        return paidEvent;
    }

    /**
     * construct trial order event from version information
     *
     * @param suiteId suite id
     * @param authCorpId auth corp id
     * @param createdTime create auth time
     * @param agentInfo edition info
     * @return WeComOrderPaidEvent
     */
    public static WeComOrderPaidEvent formatWecomTailEditionOrderPaidEvent(String suiteId, String authCorpId,
            LocalDateTime createdTime, Agent agentInfo) {
        // Build trial information and save, Enterprise WeChat has no test order, so order information is not saved
        long createdSecond = createdTime.toEpochSecond(DEFAULT_TIME_ZONE);
        WeComOrderPaidEvent paidEvent = new WeComOrderPaidEvent();
        paidEvent.setSuiteId(suiteId);
        paidEvent.setPaidCorpId(authCorpId);
        paidEvent.setEditionId(agentInfo.getEditionId());
        paidEvent.setPrice(0);
        paidEvent.setOrderType(0);
        paidEvent.setOrderTime(createdSecond);
        paidEvent.setPaidTime(createdSecond);
        paidEvent.setBeginTime(createdSecond);
        paidEvent.setUserCount(agentInfo.getUserLimit());
        // 5: unlimited trial
        Long endTime = agentInfo.getAppStatus() == 5 ?
                createdTime.plusYears(100).toEpochSecond(DEFAULT_TIME_ZONE) : agentInfo.getExpiredTime();
        paidEvent.setEndTime(endTime);
        return paidEvent;
    }

    public static Agent filterWecomEditionAgent(EditionInfo editionInfo) {
        if (null != editionInfo.getAgents()) {
            // 2-trial expired;4-purchase expired; do not handle
            return editionInfo.getAgents().stream()
                    .filter(i -> i.getAppStatus() != 2 && i.getAppStatus() != 4)
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }
}
