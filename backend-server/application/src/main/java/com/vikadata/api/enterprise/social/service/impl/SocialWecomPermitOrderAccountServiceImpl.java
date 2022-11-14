package com.vikadata.api.enterprise.social.service.impl;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.google.common.collect.Lists;

import com.vikadata.api.enterprise.social.mapper.SocialWecomPermitOrderAccountMapper;
import com.vikadata.api.enterprise.social.model.TenantMemberDto;
import com.vikadata.api.organization.service.IMemberService;
import com.vikadata.api.enterprise.social.enums.SocialCpIsvPermitActivateStatus;
import com.vikadata.api.enterprise.social.service.ISocialWecomPermitOrderAccountService;
import com.vikadata.api.enterprise.social.service.IsocialWecomPermitOrderAccountBindService;
import com.vikadata.entity.SocialWecomPermitOrderAccountBindEntity;
import com.vikadata.entity.SocialWecomPermitOrderAccountEntity;
import com.vikadata.social.wecom.model.WxCpIsvPermitListOrderAccount.AccountList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * WeCom interface license account information
 * </p>
 */
@Service
public class SocialWecomPermitOrderAccountServiceImpl extends ServiceImpl<SocialWecomPermitOrderAccountMapper, SocialWecomPermitOrderAccountEntity> implements ISocialWecomPermitOrderAccountService {

    @Resource
    private IMemberService memberService;

    @Resource
    private IsocialWecomPermitOrderAccountBindService socialWecomPermitOrderAccountBindService;

    @Override
    public List<SocialWecomPermitOrderAccountEntity> getByActiveCodes(String suiteId, String authCorpId, List<String> activeCodes) {
        return getBaseMapper().selectByActiveCodes(suiteId, authCorpId, activeCodes);
    }

    @Override
    public List<String> getActiveCodes(String suiteId, String authCorpId, List<Integer> activateStatuses) {
        return getBaseMapper().selectActiveCodes(suiteId, authCorpId, activateStatuses);
    }

    @Override
    public List<String> getActiveCodesByOrderId(String suiteId, String authCorpId, String orderId, List<Integer> activateStatuses) {
        List<String> allActiveCodes = socialWecomPermitOrderAccountBindService.getActiveCodesByOrderId(orderId);
        if (CollUtil.isEmpty(allActiveCodes) || CollUtil.isEmpty(activateStatuses)) {
            return allActiveCodes;
        }

        List<String> result = Lists.newArrayList();
        CollUtil.split(allActiveCodes, 500).forEach(activeCodes -> {
            List<String> list = getBaseMapper().selectActiveCodesByActiveCodesAndStatus(suiteId, authCorpId, activeCodes, activateStatuses);
            if (CollUtil.isNotEmpty(list)) {
                result.addAll(list);
            }
        });
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchSaveActiveCode(String suiteId, String authCorpId, String orderId, List<AccountList> allAccountList) {
        CollUtil.split(allAccountList, 500).forEach(accountLists -> {
            List<SocialWecomPermitOrderAccountEntity> accountEntities = Lists.newArrayListWithCapacity(accountLists.size());
            List<SocialWecomPermitOrderAccountBindEntity> bindEntities = Lists.newArrayListWithCapacity(accountLists.size());
            accountLists.forEach(accountList -> {
                SocialWecomPermitOrderAccountEntity accountEntity = SocialWecomPermitOrderAccountEntity.builder()
                        .suiteId(suiteId)
                        .authCorpId(authCorpId)
                        .type(accountList.getType())
                        .activateStatus(SocialCpIsvPermitActivateStatus.NO_ACTIVATED.getValue())
                        .activeCode(accountList.getActiveCode())
                        .build();
                SocialWecomPermitOrderAccountBindEntity bindEntity = SocialWecomPermitOrderAccountBindEntity.builder()
                        .suiteId(suiteId)
                        .authCorpId(authCorpId)
                        .orderId(orderId)
                        .activeCode(accountList.getActiveCode())
                        .cpUserId(accountList.getUserId())
                        .build();
                accountEntities.add(accountEntity);
                bindEntities.add(bindEntity);
            });
            saveBatch(accountEntities);
            socialWecomPermitOrderAccountBindService.saveBatch(bindEntities);
        });
    }

    @Override
    public List<String> getCpUserIdsByStatus(String suiteId, String authCorpId, List<Integer> activateStatuses) {
        return getBaseMapper().selectCpUserIdsByStatus(suiteId, authCorpId, activateStatuses);
    }

    @Override
    public List<String> getNeedActivateCpUserIds(String suiteId, String authCorpId, String spaceId) {
        // 1 Get all members
        List<TenantMemberDto> allMembers = memberService.getMemberOpenIdListBySpaceId(spaceId);
        if (CollUtil.isEmpty(allMembers)) {
            return Collections.emptyList();
        }
        // 2 Get all activated or expired WeCom user IDs
        List<String> activatedCpUserIds = getCpUserIdsByStatus(suiteId, authCorpId,
                Arrays.asList(SocialCpIsvPermitActivateStatus.ACTIVATED.getValue(), SocialCpIsvPermitActivateStatus.EXPIRED.getValue()));
        List<String> allCpUserIds = allMembers.stream()
                .map(TenantMemberDto::getOpenId)
                .collect(Collectors.toList());
        if (CollUtil.isEmpty(activatedCpUserIds)) {
            // 2.1 All to be activated
            return allCpUserIds;
        }
        else {
            // 2.2 Extraction to be activated
            Map<String, String> activatedCpUserIdMap = activatedCpUserIds.stream()
                    .collect(Collectors.toMap(k -> k, v -> v, (k1, k2) -> k2));

            return allCpUserIds.stream()
                    .filter(cpUserId -> !activatedCpUserIdMap.containsKey(cpUserId))
                    .collect(Collectors.toList());
        }
    }

    @Override
    public List<SocialWecomPermitOrderAccountEntity> getNeedRenewAccounts(String suiteId, String authCorpId, String spaceId, LocalDateTime expireTime) {
        // 1 Get all accounts that will expire at the specified time
        List<SocialWecomPermitOrderAccountEntity> expireAccounts = getBaseMapper().selectByExpireTime(suiteId, authCorpId, expireTime);
        if (CollUtil.isEmpty(expireAccounts)) {
            return Collections.emptyList();
        }
        // 2 Get all members
        List<TenantMemberDto> allMembers = memberService.getMemberOpenIdListBySpaceId(spaceId);
        if (CollUtil.isEmpty(allMembers)) {
            return Collections.emptyList();
        }
        // 3 Filter the accounts to be renewed
        List<String> allCpUserIds = allMembers.stream()
                .map(TenantMemberDto::getOpenId)
                .collect(Collectors.toList());
        return expireAccounts.stream()
                .filter(account -> allCpUserIds.contains(account.getCpUserId()))
                .collect(Collectors.toList());
    }

    @Override
    public int updateActiveStatusByActiveCodes(String suiteId, String authCorpId, List<String> activeCodes, Integer activeStatus) {
        return getBaseMapper().updateActiveStatusByActiveCodes(suiteId, authCorpId, activeCodes, activeStatus);
    }

}
