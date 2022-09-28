package com.vikadata.api.modular.social.service.impl;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.factory.SocialFactory;
import com.vikadata.api.modular.social.mapper.SocialTenantBindMapper;
import com.vikadata.api.modular.social.model.DingTalkContactDTO;
import com.vikadata.api.modular.social.model.SpaceBindTenantInfoDTO;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.api.modular.social.service.IDingTalkService;
import com.vikadata.api.modular.social.service.ISocialService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.social.service.ISocialTenantUserService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.SqlTool;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.entity.SocialTenantEntity;
import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;
import com.vikadata.social.dingtalk.model.DingTalkAppVisibleScopeResponse;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.SocialException.TENANT_BIND_FAIL;
import static com.vikadata.api.enums.exception.SocialException.USER_NOT_EXIST;

/**
 * 第三方平台集成-企业租户绑定空间 服务接口 实现
 *
 * @author Shawn Deng
 * @date 2020-12-08 23:54:21
 */
@Service
@Slf4j
public class SocialTenantBindServiceImpl extends ServiceImpl<SocialTenantBindMapper, SocialTenantBindEntity> implements ISocialTenantBindService {

    @Resource
    private SocialTenantBindMapper socialTenantBindMapper;

    @Resource
    private ISocialService socialService;

    @Resource
    private ISocialTenantService socialTenantService;

    @Resource
    private IDingTalkService dingTalkService;

    @Resource
    private ISpaceService spaceService;

    @Resource
    private ISocialTenantUserService tenantUserService;

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private ObjectMapper objectMapper;

    @Override
    public boolean getTenantBindStatus(String tenantId) {
        int count = SqlTool.retCount(socialTenantBindMapper.selectCountByTenantId(tenantId));
        return count > 0;
    }

    @Override
    public boolean getSpaceBindStatus(String spaceId) {
        // 是否空间绑定了第三方集成
        SocialTenantBindEntity tenantBind = getBySpaceId(spaceId);
        if (tenantBind == null) {
            return false;
        }
        // 查询租户
        SocialTenantEntity tenantEntity = iSocialTenantService.getByAppIdAndTenantId(tenantBind.getAppId(), tenantBind.getTenantId());
        // 租户是否开启
        return tenantEntity != null && tenantEntity.getStatus();
    }

    @Override
    public List<String> getTenantIdBySpaceId(String spaceId) {
        return socialTenantBindMapper.selectTenantIdBySpaceId(spaceId);
    }

    @Override
    public SocialTenantBindEntity getBySpaceId(String spaceId) {
        return socialTenantBindMapper.selectBySpaceId(spaceId);
    }

    @Override
    public List<String> getSpaceIdsByTenantId(String tenantId) {
        return socialTenantBindMapper.selectSpaceIdByTenantId(tenantId);
    }

    @Override
    public List<String> getSpaceIdsByTenantIdAndAppId(String tenantId, String appId) {
        return baseMapper.selectSpaceIdsByTenantIdAndAppId(tenantId, appId);
    }

    @Override
    public boolean checkExistBySpaceIdAndTenantId(String appId, String spaceId, String tenantId) {
        List<SocialTenantBindEntity> entities = baseMapper.selectBySpaceIdAndTenantId(spaceId, tenantId);
        if (entities.isEmpty()) {
            return false;
        }
        return entities.stream().anyMatch(entityClass -> StrUtil.isNotBlank(entityClass.getAppId()) && entityClass.getAppId().equals(appId));
    }

    @Override
    public void addTenantBind(String appId, String tenantId, String spaceId) {
        SocialTenantBindEntity tenantBind = new SocialTenantBindEntity();
        tenantBind.setAppId(appId);
        tenantBind.setSpaceId(spaceId);
        tenantBind.setTenantId(tenantId);
        boolean saveFlag = save(tenantBind);
        ExceptionUtil.isTrue(saveFlag, TENANT_BIND_FAIL);
    }

    @Override
    public SocialTenantBindEntity getByTenantIdAndAppId(String tenantId, String appId) {
        return getBaseMapper().selectByTenantIdAndAppId(tenantId, appId);
    }

    @Override
    public void removeBySpaceIdAndTenantId(String spaceId, String tenantId) {
        socialTenantBindMapper.deleteBySpaceIdAndTenantId(spaceId, tenantId);
    }

    @Override
    public TenantBindDTO getTenantBindInfoBySpaceId(String spaceId) {
        return baseMapper.selectBaseInfoBySpaceId(spaceId);
    }

    @Override
    public boolean getDingTalkTenantBindStatus(String tenantId, String appId) {
        int count = SqlTool.retCount(socialTenantBindMapper.selectCountByTenantIdAndAppId(tenantId, appId));
        return count > 0;
    }

    @Override
    public boolean getWeComTenantBindStatus(String tenantId, String appId) {
        int count = SqlTool.retCount(socialTenantBindMapper.selectCountByTenantIdAndAppId(tenantId, appId));
        return count > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Set<String> dingTalkAppBindSpace(String agentId, String spaceId, Long bindUserId,
            LinkedHashMap<Long, DingTalkContactDTO> contactMap) {
        AgentApp agentApp = dingTalkService.getAgentAppById(agentId);
        String corpId = agentApp.getCorpId();
        String appId = agentApp.getCustomKey();
        // 当前用户绑定的union_id
        String openId = tenantUserService.getOpenIdByTenantIdAndUserId(appId, corpId, bindUserId);
        // 第三方没有这个用户
        ExceptionUtil.isFalse(StrUtil.isBlank(openId), USER_NOT_EXIST);
        // 空间初次绑定时，增加绑定
        addTenantBind(agentApp.getCustomKey(), corpId, spaceId);
        // 绑定用户,需要在注册回调之前,防止注册了回调却没有绑定用户
        Set<String> tenantUserIds = socialService.connectDingTalkAgentAppContact(spaceId, agentId, openId, contactMap);
        // 没有企业应用信息，需要新建,如果已经停用需要更新
        SocialTenantEntity entity = socialTenantService.getByAppIdAndTenantId(appId, corpId);
        if (entity == null || !entity.getStatus()) {
            DingTalkServerAuthInfoResponse serverAuthInfo = dingTalkService.getServerAuthInfo(agentId);
            String url = dingTalkService.getDingTalkEventCallbackUrl(agentId);
            List<String> registerEvents = DingTalkEventTag.baseEvent();
            String authInfo = SocialFactory.createDingTalkAuthInfo(serverAuthInfo, agentId, url, registerEvents);
            // 保存或者更新租户信息 应用可见范围
            DingTalkAppVisibleScopeResponse visibleScope = dingTalkService.getAppVisibleScopes(agentId);
            socialTenantService.createOrUpdateWithScope(SocialPlatformType.DINGTALK, SocialAppType.INTERNAL,
                    appId, corpId, JSONUtil.toJsonStr(visibleScope), authInfo);
            // 注册应用回调事件url
            dingTalkService.registerCallbackUrl(agentId, url, registerEvents);
        }
        // 更改空间的全局状态(禁止申请加入, 禁止邀请)
        SpaceGlobalFeature feature = SpaceGlobalFeature.builder().joinable(false).invitable(false).build();
        spaceService.switchSpacePros(bindUserId, spaceId, feature);
        return tenantUserIds;
    }

    @Override
    public String getTenantBindSpaceId(String tenantId, String appId) {
        return baseMapper.selectSpaceIdByTenantIdAndAppId(tenantId, appId);
    }

    @Override
    public void removeBySpaceId(String spaceId) {
        baseMapper.deleteBySpaceId(spaceId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Set<String> dingTalkRefreshContact(String spaceId, String agentId, String operatorOpenId,
            LinkedHashMap<Long, DingTalkContactDTO> contactMap) {
        AgentApp agentApp = dingTalkService.getAgentAppById(agentId);
        Set<String> openIds = socialService.connectDingTalkAgentAppContact(spaceId, agentId, operatorOpenId, contactMap);
        // 保存或者更新租户信息
        DingTalkServerAuthInfoResponse serverAuthInfo = dingTalkService.getServerAuthInfo(agentId);
        String url = dingTalkService.getDingTalkEventCallbackUrl(agentId);
        List<String> registerEvents = DingTalkEventTag.baseEvent();
        String authInfo = SocialFactory.createDingTalkAuthInfo(serverAuthInfo, agentId, url, registerEvents);
        // 应用可见范围
        DingTalkAppVisibleScopeResponse visibleScope = dingTalkService.getAppVisibleScopes(agentId);
        socialTenantService.createOrUpdateWithScope(SocialPlatformType.DINGTALK, SocialAppType.INTERNAL,
                agentApp.getCustomKey(), agentApp.getCorpId(), JSONUtil.toJsonStr(visibleScope), authInfo);
        return openIds;
    }

    @Override
    public boolean getSpaceBindStatusByPlatformType(String spaceId, SocialPlatformType platformType) {
        int count = SqlTool.retCount(socialTenantBindMapper.selectCountBySpaceIdAndPlatform(spaceId,
                platformType.getValue()));
        return count > 0;
    }

    @Override
    public String getTenantDepartmentBindSpaceId(String appId, String tenantKey) {
        // 查询租户绑定的空间站列表
        if (StrUtil.isBlank(appId) || StrUtil.isBlank(tenantKey)) {
            log.error("查询租户绑定的空间参数错误,应用标识:{},租户标识:{}", appId, tenantKey);
            return null;
        }
        List<String> bindSpaceIds = socialTenantBindMapper.selectSpaceIdsByTenantIdAndAppId(tenantKey, appId);
        if (bindSpaceIds.isEmpty()) {
            return null;
        }
        if (bindSpaceIds.size() > 1) {
            log.error("租户[" + tenantKey + "]绑了多个空间站，错误");
            return null;
        }
        return bindSpaceIds.get(0);
    }

    @SneakyThrows
    @Override
    public SpaceBindTenantInfoDTO getSpaceBindTenantInfoByPlatform(String spaceId, SocialPlatformType socialPlatformType, Class<?> authInfoType) {
        Integer platform = null;
        if (null != socialPlatformType) {
            platform = socialPlatformType.getValue();
        }
        SpaceBindTenantInfoDTO spaceBindTenantInfoDTO = socialTenantBindMapper.selectSpaceBindTenantInfoByPlatform(spaceId, platform);
        if (null != spaceBindTenantInfoDTO && null != authInfoType && StrUtil.isNotBlank(spaceBindTenantInfoDTO.getAuthInfoStr())) {
            spaceBindTenantInfoDTO.setAuthInfo(objectMapper.readValue(spaceBindTenantInfoDTO.getAuthInfoStr(), authInfoType));
        }
        return spaceBindTenantInfoDTO;
    }

    @Override
    public List<SocialTenantEntity> getFeishuTenantsBySpaceId(String spaceId) {
        // 查询空间对应绑定的租户列表
        List<String> tenantIds = getTenantIdBySpaceId(spaceId);
        if (CollUtil.isEmpty(tenantIds)) {
            return null;
        }
        // 查询租户信息
        List<SocialTenantEntity> tenantEntities = iSocialTenantService.getByTenantIds(tenantIds);
        if (CollUtil.isEmpty(tenantEntities)) {
            return null;
        }
        // 过滤出飞书应用类型的应用
        return tenantEntities.stream()
                .filter(tenant -> SocialPlatformType.toEnum(tenant.getPlatform()) == SocialPlatformType.FEISHU)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getSpaceIdsByTenantIdsAndAppIds(List<String> tenantIds, List<String> appIds) {
        if (CollUtil.isNotEmpty(tenantIds) && CollUtil.isNotEmpty(appIds)) {
            return baseMapper.selectSpaceIdsByTenantIdsAndAppIds(tenantIds, appIds);
        }
        return ListUtil.empty();
    }
}
