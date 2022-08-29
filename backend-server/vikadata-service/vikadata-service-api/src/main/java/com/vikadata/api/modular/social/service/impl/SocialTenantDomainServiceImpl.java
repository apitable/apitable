package com.vikadata.api.modular.social.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.enums.social.TenantDomainStatus;
import com.vikadata.api.modular.social.mapper.SocialTenantDomainMapper;
import com.vikadata.api.modular.social.model.SpaceBindDomainDTO;
import com.vikadata.api.modular.social.service.ISocialTenantDomainService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.SocialTenantDomainEntity;
import com.vikadata.social.wecom.WeComTemplate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.vikadata.api.enums.exception.DatabaseException.INSERT_ERROR;

/**
 * <p>
 * 第三方平台集成-企业租户专属域名 服务接口 实现
 * </p>
 * @author Pengap
 * @date 2021/8/5 20:18:04
 */
@Slf4j
@Service
public class SocialTenantDomainServiceImpl extends ServiceImpl<SocialTenantDomainMapper, SocialTenantDomainEntity> implements ISocialTenantDomainService {

    @Resource
    private ConstProperties constProperties;

    @Autowired(required = false)
    private WeComTemplate weComTemplate;

    @Override
    public SocialTenantDomainEntity createDomain(String spaceId, String domainPrefix, String domainName) {
        SocialTenantDomainEntity entity = new SocialTenantDomainEntity()
                .setSpaceId(spaceId)
                .setDomainPrefix(domainPrefix)
                .setDomainName(domainName)
                .setStatus(TenantDomainStatus.WAIT_BIND.getCode());
        boolean flag = save(entity);
        ExceptionUtil.isTrue(flag, INSERT_ERROR);
        return entity;
    }

    @Override
    public void enabledDomain(String spaceId) {
        baseMapper.updateStatusBySpaceId(spaceId, TenantDomainStatus.ENABLED.getCode());
    }

    @Override
    public void removeDomain(List<String> spaceIds) {
        List<SocialTenantDomainEntity> entities = baseMapper.selectBySpaceIds(spaceIds);
        if (CollUtil.isNotEmpty(entities)) {
            List<String> existDomainSpace = entities.stream().map(SocialTenantDomainEntity::getSpaceId).collect(Collectors.toList());
            baseMapper.deleteSpaceDomainBySpaceIds(existDomainSpace);
            if (null != weComTemplate) {
                entities.forEach(entity -> weComTemplate.removeEnpDomainName(entity.getDomainPrefix()));
            }
        }
    }

    @Override
    public String getDomainNameBySpaceId(String spaceId, boolean apendHttpsPrefix) {
        // 获取空间站对应域名
        Map<String, String> spaceDomainToMap = this.getSpaceDomainBySpaceIdsToMap(Collections.singletonList(spaceId));
        String domainName = spaceDomainToMap.getOrDefault(spaceId, this.getSpaceDefaultDomainName());
        // 是否添加Https前缀
        if (apendHttpsPrefix) {
            domainName = StrUtil.prependIfMissingIgnoreCase(domainName, "https://");
        }
        else {
            domainName = ReUtil.replaceAll(domainName, "http://|https://", StrUtil.EMPTY);
        }
        return domainName;
    }

    @Override
    public String getSpaceDefaultDomainName() {
        return ReUtil.replaceAll(constProperties.getServerDomain(), "http://|https://", StrUtil.EMPTY);
    }

    @Override
    public String getSpaceIdByDomainName(String domainName) {
        return baseMapper.selectSpaceIdByDomainName(domainName);
    }

    @Override
    public List<SpaceBindDomainDTO> getSpaceDomainBySpaceIds(List<String> spaceIds) {
        // 清理意外的空白字符
        CollUtil.removeBlank(spaceIds);
        if (CollUtil.isEmpty(spaceIds)) {
            return Collections.emptyList();
        }
        List<SpaceBindDomainDTO> result = new ArrayList<>();

        if (CollUtil.isNotEmpty(spaceIds)) {
            // 查询空间站列表绑定的domain
            List<SpaceBindDomainDTO> dtoList = baseMapper.selectSpaceDomainBySpaceIds(spaceIds);
            Map<String, SpaceBindDomainDTO> dtoTOmap = dtoList.stream().collect(Collectors.toMap(SpaceBindDomainDTO::getSpaceId, v -> v));

            for (String spaceId : spaceIds) {
                SpaceBindDomainDTO dto = dtoTOmap.get(spaceId);
                if (null == dto || !TenantDomainStatus.available(dto.getStatus())) {
                    dto = SpaceBindDomainDTO.builder().spaceId(spaceId).domainName(this.getSpaceDefaultDomainName()).status(TenantDomainStatus.ENABLED.getCode()).build();
                }
                result.add(dto);
            }
        }
        return result;
    }

    @Override
    public Map<String, String> getSpaceDomainBySpaceIdsToMap(List<String> spaceIds) {
        if (CollUtil.isEmpty(spaceIds)) {
            return Collections.emptyMap();
        }
        List<SpaceBindDomainDTO> spaceDomainList = this.getSpaceDomainBySpaceIds(spaceIds);
        return spaceDomainList.stream()
                .collect(Collectors.toMap(SpaceBindDomainDTO::getSpaceId, dto -> StrUtil.emptyToDefault(dto.getDomainName(), "")));
    }

    @Override
    public SpaceBindDomainDTO getSpaceDomainByDomainName(String domainName) {
        return baseMapper.selectSpaceDomainByDomainName(domainName);
    }

}
