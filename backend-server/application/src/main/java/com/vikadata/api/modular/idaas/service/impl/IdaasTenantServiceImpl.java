package com.vikadata.api.modular.idaas.service.impl;

import java.util.Objects;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.exception.IdaasException;
import com.vikadata.api.modular.idaas.mapper.IdaasTenantMapper;
import com.vikadata.api.modular.idaas.model.IdaasTenantCreateRo;
import com.vikadata.api.modular.idaas.model.IdaasTenantCreateVo;
import com.vikadata.api.modular.idaas.service.IIdaasAppBindService;
import com.vikadata.api.modular.idaas.service.IIdaasTenantService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.IdaasAppBindEntity;
import com.vikadata.entity.IdaasTenantEntity;
import com.vikadata.integration.idaas.IdaasApiException;
import com.vikadata.integration.idaas.IdaasTemplate;
import com.vikadata.integration.idaas.api.SystemApi;
import com.vikadata.integration.idaas.model.TenantRequest;
import com.vikadata.integration.idaas.model.TenantResponse;
import com.vikadata.integration.idaas.support.ServiceAccount;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * IDaaS tenant information
 * </p>
 */
@Slf4j
@Service
public class IdaasTenantServiceImpl extends ServiceImpl<IdaasTenantMapper, IdaasTenantEntity> implements IIdaasTenantService {

    @Autowired(required = false)
    private IdaasTemplate idaasTemplate;

    @Resource
    private IIdaasAppBindService idaasAppBindService;

    @Override
    public IdaasTenantCreateVo createTenant(IdaasTenantCreateRo request) {
        SystemApi systemApi = idaasTemplate.getSystemApi();
        // 1 Create tenants and their administrators
        // 1.1 Build Create Tenant Parameters
        TenantRequest tenantRequest = new TenantRequest();
        tenantRequest.setName(request.getTenantName());
        tenantRequest.setDisplayName(request.getCorpName());
        TenantRequest.Admin tenantAdmin = new TenantRequest.Admin();
        tenantAdmin.setUsername(request.getAdminUsername());
        tenantAdmin.setPassword(request.getAdminPassword());
        tenantRequest.setAdmin(tenantAdmin);
        // 1.2 Use system level ServiceAccount calls
        ServiceAccount systemServiceAccount = new ServiceAccount();
        IdaasTenantCreateRo.ServiceAccount requestServiceAccount = request.getServiceAccount();
        systemServiceAccount.setClientId(requestServiceAccount.getClientId());
        ServiceAccount.PrivateKey privateKey = new ServiceAccount.PrivateKey();
        IdaasTenantCreateRo.ServiceAccount.PrivateKey requestPrivateKey = requestServiceAccount.getPrivateKey();
        privateKey.setP(requestPrivateKey.getP());
        privateKey.setKty(requestPrivateKey.getKty());
        privateKey.setQ(requestPrivateKey.getQ());
        privateKey.setD(requestPrivateKey.getD());
        privateKey.setE(requestPrivateKey.getE());
        privateKey.setUse(requestPrivateKey.getUse());
        privateKey.setKid(requestPrivateKey.getKid());
        privateKey.setQi(requestPrivateKey.getQi());
        privateKey.setDp(requestPrivateKey.getDp());
        privateKey.setDq(requestPrivateKey.getDq());
        privateKey.setN(requestPrivateKey.getN());
        systemServiceAccount.setPrivateKey(privateKey);
        // 1.3 Create a tenant and its default administrator
        TenantResponse tenantResponse;
        try {
            tenantResponse = systemApi.tenant(tenantRequest, systemServiceAccount);
            log.info("IDaaS tenant response: " + JSONUtil.toJsonStr(tenantResponse));
        }
        catch (IdaasApiException ex) {
            log.error("Failed to create tenant.", ex);

            throw new BusinessException(IdaasException.API_ERROR);
        }
        // 2 Generate the ServiceAccount of the tenant
        ServiceAccount tenantServiceAccount;
        try {
            tenantServiceAccount = systemApi.serviceAccount(tenantRequest.getName(), systemServiceAccount);
            log.info("IDaaS serviceAccount response: " + JSONUtil.toJsonStr(tenantServiceAccount));
        }
        catch (IdaasApiException ex) {
            log.error("Failed to create ServiceAccount.", ex);

            throw new BusinessException(IdaasException.API_ERROR);
        }

        // 3 Save related information
        IdaasTenantEntity tenantEntity = getByTenantName(tenantRequest.getName());
        if (Objects.isNull(tenantEntity)) {
            // If the tenant does not exist, create it
            tenantEntity = IdaasTenantEntity.builder()
                    .tenantName(tenantResponse.getName())
                    .serviceAccount(JSONUtil.toJsonStr(tenantServiceAccount))
                    .build();
            save(tenantEntity);
        }
        else {
            // Update information if it already exists
            tenantEntity.setTenantName(tenantResponse.getName());
            tenantEntity.setServiceAccount(JSONUtil.toJsonStr(tenantServiceAccount));
            updateById(tenantEntity);
        }

        return IdaasTenantCreateVo.builder()
                .id(tenantEntity.getId())
                .tenantId(tenantResponse.getId())
                .tenantName(tenantEntity.getTenantName())
                .build();
    }

    @Override
    public IdaasTenantEntity getByTenantName(String tenantName) {
        return getBaseMapper().selectByTenantName(tenantName);
    }

    @Override
    public IdaasTenantEntity getBySpaceId(String spaceId) {
        IdaasAppBindEntity appBindEntity = idaasAppBindService.getBySpaceId(spaceId);
        if (Objects.isNull(appBindEntity)) {
            return null;
        }

        return getByTenantName(appBindEntity.getTenantName());
    }

}
