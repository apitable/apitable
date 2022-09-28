package com.vikadata.api.modular.social.factory;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.TimeZone;
import java.util.stream.Collectors;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import me.chanjar.weixin.cp.bean.WxCpUser;

import com.vikadata.api.enums.finance.Currency;
import com.vikadata.api.enums.finance.OrderChannel;
import com.vikadata.api.enums.finance.OrderPhase;
import com.vikadata.api.enums.finance.OrderStatus;
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
import com.vikadata.api.util.billing.OrderUtil;
import com.vikadata.api.util.billing.WeComPlanConfigManager;
import com.vikadata.entity.EconomicOrderEntity;
import com.vikadata.entity.EconomicOrderMetadataEntity;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.SocialCpTenantUserEntity;
import com.vikadata.entity.SocialOrderWecomEntity;
import com.vikadata.entity.SocialTenantDepartmentBindEntity;
import com.vikadata.entity.SocialTenantDepartmentEntity;
import com.vikadata.entity.SocialTenantUserEntity;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.TeamMemberRelEntity;
import com.vikadata.social.dingtalk.event.sync.http.OrgSuiteAuthEvent;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse.DingTalkAgentApp;
import com.vikadata.social.feishu.enums.LarkOrderBuyType;
import com.vikadata.social.feishu.enums.PricePlanType;
import com.vikadata.social.feishu.event.UserInfo;
import com.vikadata.social.feishu.event.app.OrderPaidEvent;
import com.vikadata.social.feishu.model.FeishuDepartmentInfo;
import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;
import com.vikadata.social.feishu.model.v3.UserStatus;
import com.vikadata.system.config.billing.Plan;
import com.vikadata.system.config.billing.Price;

import static com.vikadata.social.feishu.constants.FeishuConstants.FEISHU_ROOT_DEPT_ID;

/**
 * 创建工厂
 *
 * @author Shawn Deng
 * @date 2020-12-18 22:38:36
 */
public class SocialFactory {

    /**
     * 人民币缩写
     */
    private static final String CURRENCY_CNY = "CNY";

    public static <T extends FeishuDepartmentInfo> SocialTenantDepartmentEntity createTenantDepartment(String spaceId, String tenantKey, T departmentInfo) {
        SocialTenantDepartmentEntity tenantDepartment = new SocialTenantDepartmentEntity();
        tenantDepartment.setId(IdWorker.getId());
        tenantDepartment.setTenantId(tenantKey);
        tenantDepartment.setSpaceId(spaceId);
        tenantDepartment.setDepartmentId(departmentInfo.getId());
        tenantDepartment.setOpenDepartmentId(departmentInfo.getOpenDepartmentId());
        tenantDepartment.setParentId(departmentInfo.getParentId());
        tenantDepartment.setParentOpenDepartmentId(departmentInfo.getParentOpenDepartmentId());
        tenantDepartment.setDepartmentName(departmentInfo.getName());
        return tenantDepartment;
    }

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

    public static EconomicOrderEntity createLarkTenantOrder(OrderPaidEvent event, Price price, String spaceId,
            LocalDateTime startedAt) {
        int month = getLarkOrderMonth(PricePlanType.of(event.getPricePlanType()), event.getBuyCount());
        LocalDateTime timeExpired;
        // 飞书试用期 15天
        if (PricePlanType.TRIAL.getType().equals(event.getPricePlanType())) {
            timeExpired = startedAt.plusDays(15);
        }
        else {
            timeExpired = startedAt.plusMonths(month);
        }
        EconomicOrderEntity orderEntity = new EconomicOrderEntity();
        orderEntity.setSpaceId(spaceId);
        orderEntity.setOrderNo(OrderUtil.createOrderId());
        orderEntity.setOrderChannel(OrderChannel.LARK.getName());
        orderEntity.setChannelOrderId(event.getOrderId());
        orderEntity.setProduct(price.getProduct());
        orderEntity.setSeat(price.getSeat());
        orderEntity.setType(getLarkOrderType(event.getBuyType()).getType());
        orderEntity.setType(Objects.requireNonNull(OrderType.ofName(event.getBuyType())).getType());
        // 计算之后的 month
        orderEntity.setMonth(month);
        orderEntity.setCurrency(Currency.CNY.name());
        orderEntity.setAmount(event.getOrderPayPrice().intValue());
        orderEntity.setActualAmount(event.getOrderPayPrice().intValue());
        orderEntity.setStatus(OrderStatus.FINISHED.getName());
        orderEntity.setIsPaid(true);
        orderEntity.setPaidTime(LocalDateTime.ofInstant(Instant.ofEpochMilli(Long.parseLong(event.getPayTime()) * 1000),
                TimeZone.getDefault().toZoneId()));
        orderEntity.setExpireTime(timeExpired);
        orderEntity.setCreatedTime(LocalDateTime.ofInstant(Instant.ofEpochMilli(Long.parseLong(event.getCreateTime()) * 1000),
                TimeZone.getDefault().toZoneId()));
        if (event.getPricePlanType().equals(OrderPhase.TRIAL.getName())) {
            orderEntity.setOrderPhase(OrderPhase.TRIAL.getName());
        }
        else {
            orderEntity.setOrderPhase(OrderPhase.FIXEDTERM.getName());
        }
        // 不记录createdBy 因为app开通之后，用户可能还没有绑定，无法获取用户的userId
        return orderEntity;
    }

    public static EconomicOrderMetadataEntity createLarkOrderMetadata(OrderPaidEvent event, String orderNo) {
        EconomicOrderMetadataEntity orderMetadata = new EconomicOrderMetadataEntity();
        orderMetadata.setOrderNo(orderNo);
        orderMetadata.setMetadata(JSONUtil.toJsonStr(event));
        orderMetadata.setOrderChannel(OrderChannel.LARK.getName());
        return orderMetadata;
    }

    public static OrderType getLarkOrderType(String buyType) {
        switch (LarkOrderBuyType.of(buyType)) {
            case UPGRADE:
                return OrderType.UPGRADE;
            case RENEW:
                return OrderType.RENEW;
            default:
                return OrderType.BUY;
        }
    }

    /**
     * 获取订单生效月数
     * @param planType 飞书付费方案类型
     * @param count 付费个数
     * @return 生效月数
     */
    public static Integer getLarkOrderMonth(PricePlanType planType, Integer count) {
        switch (planType) {
            case PER_MONTH:
                return count;
            case PER_YEAR:
                return count * 12;
            case TRIAL:
                return 0;
            default:
                // 无限期
                return -1;
        }
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
     * 创建企微订阅对应的经济系统订单实体
     *
     * @param orderWeComEntity 企微订单信息
     * @param plan 订阅计划
     * @param spaceId 租户的空间站 ID
     * @return 经济系统订单实体
     * @author 刘斌华
     * @date 2022-05-05 17:27:23
     */
    public static EconomicOrderEntity createWeComTenantOrder(SocialOrderWecomEntity orderWeComEntity, Plan plan, String spaceId) {
        // 保存信息
        EconomicOrderEntity orderEntity = new EconomicOrderEntity();
        orderEntity.setSpaceId(spaceId);
        orderEntity.setOrderNo(OrderUtil.createOrderId());
        orderEntity.setOrderChannel(OrderChannel.WECOM.getName());
        orderEntity.setChannelOrderId(orderWeComEntity.getOrderId());
        orderEntity.setProduct(plan.getProduct());
        orderEntity.setSeat(plan.getSeats());
        orderEntity.setType(getOrderTypeFromWeCom(orderWeComEntity.getOrderType()).getType());
        orderEntity.setMonth(getWeComOrderMonth(orderWeComEntity.getOrderPeriod()));
        orderEntity.setCurrency(CURRENCY_CNY);
        orderEntity.setAmount(orderWeComEntity.getPrice());
        orderEntity.setActualAmount(orderWeComEntity.getPrice());
        orderEntity.setStatus(OrderStatus.FINISHED.getName());
        orderEntity.setIsPaid(true);
        orderEntity.setPaidTime(orderWeComEntity.getPaidTime());
        orderEntity.setExpireTime(orderWeComEntity.getEndTime());
        orderEntity.setCreatedTime(orderWeComEntity.getOrderTime());
        if (WeComPlanConfigManager.isWeComTrialEdition(orderWeComEntity.getEditionId())) {
            orderEntity.setOrderPhase(OrderPhase.TRIAL.getName());
        }
        else {
            orderEntity.setOrderPhase(OrderPhase.FIXEDTERM.getName());
        }
        // 不记录createdBy 因为app开通之后，用户可能还没有绑定，无法获取用户的userId
        return orderEntity;
    }

    public static EconomicOrderEntity createWeComTenantTrialOrder(String spaceId, Plan plan, OrderType orderType, LocalDateTime createdTime, LocalDateTime expiredTime) {
        // 保存信息
        EconomicOrderEntity orderEntity = new EconomicOrderEntity();
        orderEntity.setSpaceId(spaceId);
        orderEntity.setOrderNo(OrderUtil.createOrderId());
        orderEntity.setOrderChannel(OrderChannel.WECOM.getName());
        orderEntity.setChannelOrderId(null);
        orderEntity.setProduct(plan.getProduct());
        orderEntity.setSeat(plan.getSeats());
        orderEntity.setType(orderType.getType());
        orderEntity.setMonth(0);
        orderEntity.setCurrency(CURRENCY_CNY);
        orderEntity.setAmount(0);
        orderEntity.setActualAmount(0);
        orderEntity.setStatus(OrderStatus.FINISHED.getName());
        orderEntity.setIsPaid(true);
        orderEntity.setPaidTime(createdTime);
        orderEntity.setExpireTime(expiredTime);
        orderEntity.setCreatedTime(createdTime);
        orderEntity.setOrderPhase(OrderPhase.TRIAL.getName());
        // 不记录createdBy 因为app开通之后，用户可能还没有绑定，无法获取用户的userId
        return orderEntity;
    }

    /**
     * 创建企微订阅对应的经济系统订单元数据实体
     *
     * @param orderWeComEntity 企微订单信息
     * @param orderNo 经济系统订单号
     * @return 经济系统订单元数据实体
     * @author 刘斌华
     * @date 2022-05-05 17:28:43
     */
    public static EconomicOrderMetadataEntity createWeComOrderMetadata(SocialOrderWecomEntity orderWeComEntity, String orderNo) {
        EconomicOrderMetadataEntity orderMetadata = new EconomicOrderMetadataEntity();
        orderMetadata.setOrderNo(orderNo);
        orderMetadata.setMetadata(JSONUtil.toJsonStr(orderWeComEntity));
        orderMetadata.setOrderChannel(OrderChannel.WECOM.getName());
        return orderMetadata;
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
            return 0;
        }

        // 企微返回的购买时长以天为单位，365 天为 1 年
        return orderPeriod / 365 * 12;
    }

    /**
     * 将企业微信的订单类型，转换为对应的维格订单类型
     *
     * @param weComOrderType 订单类型。0：新购应用；1：扩容应用人数；2：续期应用时间；3：变更版本
     * @return 对应的维格订单类型
     * @author 刘斌华
     * @date 2022-05-05 17:04:17
     */
    private static OrderType getOrderTypeFromWeCom(Integer weComOrderType) {
        switch (weComOrderType) {
            case 0:
            case 3:
                return OrderType.BUY;
            case 1:
                return OrderType.UPGRADE;
            case 2:
                return OrderType.RENEW;
            default:
                throw new IllegalArgumentException("Unsupported weCom orderType: " + weComOrderType);
        }
    }

}
