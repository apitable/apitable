package com.vikadata.api.modular.idaas.service.impl;

import java.util.Objects;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.exception.IdaasException;
import com.vikadata.api.modular.idaas.mapper.IdaasAppBindMapper;
import com.vikadata.api.modular.idaas.model.IdaasAppBindRo;
import com.vikadata.api.modular.idaas.model.IdaasAppBindVo;
import com.vikadata.api.modular.idaas.service.IIdaasAppBindService;
import com.vikadata.api.modular.idaas.service.IIdaasAppService;
import com.vikadata.api.modular.idaas.service.IIdaasAuthService;
import com.vikadata.api.modular.idaas.service.IIdaasTenantService;
import com.vikadata.boot.autoconfigure.idaas.IdaasProperties;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.IdaasAppBindEntity;
import com.vikadata.entity.IdaasAppEntity;
import com.vikadata.entity.IdaasTenantEntity;
import com.vikadata.integration.idaas.IdaasApiException;
import com.vikadata.integration.idaas.IdaasTemplate;
import com.vikadata.integration.idaas.model.WellKnowResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 玉符 IDaaS 应用与空间站绑定
 * </p>
 * @author 刘斌华
 * @date 2022-05-19 11:30:58
 */
@Slf4j
@Service
public class IdaasAppBindServiceImpl extends ServiceImpl<IdaasAppBindMapper, IdaasAppBindEntity> implements IIdaasAppBindService {

    @Autowired(required = false)
    private IdaasProperties idaasProperties;

    @Autowired(required = false)
    private IdaasTemplate idaasTemplate;

    @Resource
    private IIdaasAppService idaasAppService;

    @Resource
    private IIdaasAuthService idaasAuthService;

    @Resource
    private IIdaasTenantService idaasTenantService;

    @Override
    public IdaasAppBindEntity getBySpaceId(String spaceId) {
        return getBaseMapper().selectBySpaceId(spaceId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public IdaasAppBindVo bindTenantApp(IdaasAppBindRo request) {
        IdaasTenantEntity tenantEntity = idaasTenantService.getByTenantName(request.getTenantName());
        if (Objects.isNull(tenantEntity)) {
            // 租户信息不存在
            throw new BusinessException(IdaasException.PARAM_INVALID);
        }
        // 1 调用 Well-known 接口，获取相关信息
        WellKnowResponse wellKnowResponse;
        try {
            wellKnowResponse = idaasTemplate.getSystemApi()
                    .fetchWellKnown(request.getAppWellKnown());
        }
        catch (IdaasApiException ex) {
            log.error("Failed to fetch Well-known response.", ex);

            throw new BusinessException(IdaasException.API_ERROR);
        }
        // 2 保存或者更新应用信息
        String clientId = request.getAppClientId();
        IdaasAppEntity appEntity = idaasAppService.getByClientId(clientId);
        if (Objects.isNull(appEntity)) {
            // 应用信息不存在，则创建应用
            appEntity = IdaasAppEntity.builder()
                    .tenantName(tenantEntity.getTenantName())
                    .clientId(clientId)
                    .clientSecret(request.getAppClientSecret())
                    .authorizationEndpoint(wellKnowResponse.getAuthorizationEndpoint())
                    .tokenEndpoint(wellKnowResponse.getTokenEndpoint())
                    .userinfoEndpoint(wellKnowResponse.getUserinfoEndpoint())
                    .build();
            idaasAppService.save(appEntity);
        }
        else {
            // 已存在应用，则更新信息
            appEntity.setTenantName(tenantEntity.getTenantName());
            appEntity.setClientId(clientId);
            appEntity.setClientSecret(request.getAppClientSecret());
            appEntity.setAuthorizationEndpoint(wellKnowResponse.getAuthorizationEndpoint());
            appEntity.setTokenEndpoint(wellKnowResponse.getTokenEndpoint());
            appEntity.setUserinfoEndpoint(wellKnowResponse.getUserinfoEndpoint());
            idaasAppService.updateById(appEntity);
        }
        // 3 保存或者更新绑定信息
        IdaasAppBindEntity appBindEntity = getBySpaceId(request.getSpaceId());
        if (Objects.isNull(appBindEntity)) {
            // 信息不存在，则创建绑定关系
            appBindEntity = IdaasAppBindEntity.builder()
                    .tenantName(tenantEntity.getTenantName())
                    .clientId(clientId)
                    .spaceId(request.getSpaceId())
                    .build();
            save(appBindEntity);
        }
        else {
            // 已存在绑定，则更新信息
            appBindEntity.setTenantName(tenantEntity.getTenantName());
            appBindEntity.setClientId(clientId);
            appBindEntity.setSpaceId(request.getSpaceId());
            updateById(appBindEntity);
        }

        return IdaasAppBindVo.builder()
                .initiateLoginUri(idaasAuthService.getVikaLoginUrl(clientId))
                .redirectUri(idaasAuthService.getVikaCallbackUrl(clientId,
                        idaasProperties.isSelfHosted() ? null : request.getSpaceId()))
                .build();
    }

}
