package com.vikadata.api.modular.idaas.service.impl;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.json.JSONUtil;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.idaas.core.IdaasApiException;
import com.apitable.starter.idaas.core.IdaasTemplate;
import com.apitable.starter.idaas.core.api.GroupApi;
import com.apitable.starter.idaas.core.api.UserApi;
import com.apitable.starter.idaas.core.model.GroupsRequest;
import com.apitable.starter.idaas.core.model.GroupsResponse;
import com.apitable.starter.idaas.core.model.GroupsResponse.GroupResponse;
import com.apitable.starter.idaas.core.model.UsersRequest;
import com.apitable.starter.idaas.core.model.UsersResponse;
import com.apitable.starter.idaas.core.model.UsersResponse.UserResponse;
import com.apitable.starter.idaas.core.model.UsersResponse.UserResponse.Values;
import com.apitable.starter.idaas.core.support.ServiceAccount;
import com.vikadata.api.enums.exception.IdaasException;
import com.vikadata.api.modular.idaas.model.IdaasContactChange;
import com.vikadata.api.modular.idaas.service.IIdaasContactChangeService;
import com.vikadata.api.modular.idaas.service.IIdaasContactService;
import com.vikadata.api.modular.idaas.service.IIdaasGroupBindService;
import com.vikadata.api.modular.idaas.service.IIdaasTenantService;
import com.vikadata.api.modular.idaas.service.IIdaasUserBindService;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.IdaasGroupBindEntity;
import com.vikadata.entity.IdaasTenantEntity;
import com.vikadata.entity.IdaasUserBindEntity;
import com.vikadata.entity.MemberEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import static com.vikadata.api.config.AsyncTaskExecutorConfig.DEFAULT_EXECUTOR_BEAN_NAME;

/**
 * <p>
 * IDaaS Address book
 * </p>
 */
@Slf4j
@Service
public class IdaasContactServiceImpl implements IIdaasContactService {

    private static final String CACHE_EXISTED_GROUP = "idaas:%s:existed_group";

    private static final String CACHE_NEW_GROUP = "idaas:%s:new_group";

    private static final String CACHE_GROUP_ITEM = "idaas:%s:group_item";

    private static final String CACHE_NEW_USER = "idaas:%s:new_user";

    private static final String CACHE_USER_ITEM = "idaas:%s:user_item";

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Autowired(required = false)
    private IdaasTemplate idaasTemplate;

    @Resource
    private IIdaasContactChangeService idaasContactChangeService;

    @Resource
    private IIdaasGroupBindService idaasGroupBindService;

    @Resource
    private IIdaasTenantService idaasTenantService;

    @Resource
    private IIdaasUserBindService idaasUserBindService;

    @Resource
    private IMemberService memberService;

    @Resource
    private ISpaceService spaceService;

    @Override
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    public void syncContact(String spaceId, Long userId) {
        IdaasTenantEntity tenantEntity = idaasTenantService.getBySpaceId(spaceId);
        if (Objects.isNull(tenantEntity)) {
            throw new BusinessException(IdaasException.APP_SPACE_NOT_BIND);
        }

        // 1 Set the space station to synchronizing
        spaceService.setContactSyncing(spaceId, tenantEntity.getTenantName());
        try {
            ServiceAccount serviceAccount = JSONUtil.toBean(tenantEntity.getServiceAccount(), ServiceAccount.class);
            IdaasContactChange contactChange = new IdaasContactChange();
            // 2 Get Organization Structure
            fetchGroups(tenantEntity.getTenantName(), serviceAccount, spaceId, contactChange);
            // 3 Get Members
            fetchUsers(tenantEntity.getTenantName(), serviceAccount, spaceId, contactChange);
            // 4 Save change information
            idaasContactChangeService.saveContactChange(tenantEntity.getTenantName(), spaceId, contactChange);
        }
        catch (IdaasApiException ex) {
            log.error("Exception occurred while executing contact api.", ex);

            throw new BusinessException(IdaasException.API_ERROR);
        }
        finally {
            // 5 Empty temporary cache
            stringRedisTemplate.delete(Arrays.asList(
                    getCacheExistedGroupKey(spaceId),
                    getCacheNewGroupKey(spaceId),
                    getCacheGroupItemKey(spaceId),
                    getCacheNewUserKey(spaceId),
                    getCacheUserItemKey(spaceId)
            ));
            // 6 Release the synchronizing status of the space station
            spaceService.contactFinished(spaceId);
        }
    }

    /**
     * Get and process user group information
     *
     * @param tenantName tenant name
     * @param serviceAccount tenant level ServiceAccount
     * @param spaceId bound space
     * @param contactChange Change information
     */
    private void fetchGroups(String tenantName, ServiceAccount serviceAccount, String spaceId, IdaasContactChange contactChange) throws IdaasApiException {
        String cacheExistedGroupKey = getCacheExistedGroupKey(spaceId);
        String cacheNewGroupKey = getCacheNewGroupKey(spaceId);
        String cacheGroupItemKey = getCacheGroupItemKey(spaceId);
        SetOperations<String, String> setOperations = stringRedisTemplate.opsForSet();
        HashOperations<String, String, String> hashOperations = stringRedisTemplate.opsForHash();
        // 1 Get the latest user group information and add it to the cache
        GroupApi groupApi = idaasTemplate.getGroupApi();
        GroupsRequest groupsRequest = new GroupsRequest();
        groupsRequest.setPageIndex(0);
        groupsRequest.setPageSize(500);
        groupsRequest.setOrderBy(Arrays.asList("_udOrder", "_createdOn"));
        GroupsResponse groupsResponse = groupApi.groups(groupsRequest, serviceAccount, tenantName);
        List<GroupResponse> groupResponses = groupsResponse.getData();
        AtomicInteger order = new AtomicInteger(0);
        while (CollUtil.isNotEmpty(groupResponses)) {
            // 1.1 Cache the latest user group information
            groupResponses.forEach(groupResponse -> {
                // Sort the returned order of the list as the organization structure
                groupResponse.setOrder(order.incrementAndGet());

                setOperations.add(cacheNewGroupKey, groupResponse.getId());
                hashOperations.put(cacheGroupItemKey, groupResponse.getId(), JSONUtil.toJsonStr(groupResponse));
            });

            groupsRequest.setPageIndex(groupsRequest.getPageIndex() + 1);
            groupsResponse = groupApi.groups(groupsRequest, serviceAccount, tenantName);
            groupResponses = groupsResponse.getData();
        }
        // 2 Get all bound user group information
        List<IdaasGroupBindEntity> groupBinds = idaasGroupBindService.getAllBySpaceIdIgnoreDeleted(spaceId);
        if (CollUtil.isNotEmpty(groupBinds)) {
            // 2.1 Add the bound user group to the cache
            String[] bindGroupIds = groupBinds.stream()
                    .map(IdaasGroupBindEntity::getGroupId)
                    .toArray(String[]::new);
            setOperations.add(cacheExistedGroupKey, bindGroupIds);
        }
        // 3 Traverse all the bound user group information to obtain the user groups to be updated and deleted
        contactChange.setUpdateGroups(Lists.newArrayList());
        contactChange.setDeleteGroups(Lists.newArrayList());
        groupBinds.forEach(groupBind -> {
            String groupResponseStr = hashOperations.get(cacheGroupItemKey, groupBind.getGroupId());
            GroupResponse groupResponse = Optional.ofNullable(groupResponseStr)
                    .filter(CharSequenceUtil::isNotBlank)
                    .map(str -> JSONUtil.toBean(str, GroupResponse.class))
                    .orElse(null);
            if (Objects.isNull(groupResponse)) {
                // 3.1 The bound user group does not exist in the latest list, you need to delete it
                contactChange.getDeleteGroups().add(groupBind);
            }
            else if (!Objects.equals(groupBind.getGroupName(), groupResponse.getName()) ||
                    !Objects.equals(groupBind.getGroupOrder(), groupResponse.getOrder()) ||
                    Boolean.TRUE.equals(groupBind.getIsDeleted())) {
                // 3.2 If the name and sorting of the bound user group are changed or re enabled, the information needs to be updated
                groupBind.setGroupName(groupResponse.getName());
                groupBind.setGroupOrder(groupResponse.getOrder());
                contactChange.getUpdateGroups().add(groupBind);
            }
        });

        // 4 Get the user group to be added
        Set<String> toBeAddGroupIds = setOperations.difference(cacheNewGroupKey, cacheExistedGroupKey);
        List<GroupResponse> toBeAddGroupResponses = Optional.ofNullable(toBeAddGroupIds)
                .filter(list -> !list.isEmpty())
                .map(groupIds -> hashOperations.multiGet(cacheGroupItemKey, groupIds))
                .filter(list -> !list.isEmpty())
                .map(strs -> strs.stream()
                        .map(str -> JSONUtil.toBean(str, GroupResponse.class))
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
        contactChange.setAddGroups(toBeAddGroupResponses);
    }

    /**
     * Obtain and process user information
     *
     * @param tenantName tenant name
     * @param serviceAccount tenant level ServiceAccount
     * @param spaceId bound space
     * @param contactChange change information
     */
    private void fetchUsers(String tenantName, ServiceAccount serviceAccount, String spaceId, IdaasContactChange contactChange) throws IdaasApiException {
        String cacheNewUserKey = getCacheNewUserKey(spaceId);
        String cacheUserItemKey = getCacheUserItemKey(spaceId);
        SetOperations<String, String> setOperations = stringRedisTemplate.opsForSet();
        HashOperations<String, String, String> hashOperations = stringRedisTemplate.opsForHash();
        // 1 Get the latest user information and add it to the cache
        UserApi userApi = idaasTemplate.getUserApi();
        UsersRequest usersRequest = new UsersRequest();
        usersRequest.setStatus("ACTIVE");
        usersRequest.setEndTime(Instant.now().toEpochMilli());
        usersRequest.setPageIndex(0);
        usersRequest.setPageSize(500);
        usersRequest.setOrderBy(Collections.singletonList("_createdOn"));
        UsersResponse usersResponse = userApi.users(usersRequest, serviceAccount, tenantName);
        List<UserResponse> userResponses = usersResponse.getData();
        while (CollUtil.isNotEmpty(userResponses)) {
            // 1.1 Cache the latest user information
            userResponses.forEach(userResponse -> {
                setOperations.add(cacheNewUserKey, userResponse.getId());
                hashOperations.put(cacheUserItemKey, userResponse.getId(), JSONUtil.toJsonStr(userResponse));
            });

            usersRequest.setPageIndex(usersRequest.getPageIndex() + 1);
            usersResponse = userApi.users(usersRequest, serviceAccount, tenantName);
            userResponses = usersResponse.getData();
        }
        // 2 Get the information of all IDaaS users
        Set<String> allNewUserIds = setOperations.members(cacheNewUserKey);
        // 3 Get the bound member information of the space station
        List<MemberEntity> allMembers = memberService.getMembersBySpaceId(spaceId, true);
        Map<Long, MemberEntity> allMemberMap = allMembers.stream()
                .collect(Collectors.toMap(MemberEntity::getUserId, v -> v, (k1, k2) -> k2));
        // 3.1 Traverse all members to get the members to be deleted
        contactChange.setDeleteMemberIds(Lists.newArrayList());
        // Batch processing to prevent mass data operation
        CollUtil.split(allMembers, 500).forEach(members -> {
            List<Long> vikaUserIds = members.stream()
                    .map(MemberEntity::getUserId)
                    .collect(Collectors.toList());
            List<IdaasUserBindEntity> userBinds = idaasUserBindService.getAllByVikaUserIdsIgnoreDeleted(vikaUserIds);
            userBinds.forEach(userBind -> {
                MemberEntity member = allMemberMap.get(userBind.getVikaUserId());
                if (!CollUtil.contains(allNewUserIds, userBind.getUserId()) && Boolean.FALSE.equals(member.getIsDeleted())) {
                    // 3.2 If the bound member is not in the new user list, you need to delete it
                    contactChange.getDeleteMemberIds().add(member.getId());
                }
            });
        });
        // 4 Traverse all IDaaS users to obtain the information to be added and updated
        contactChange.setAddUsers(Lists.newArrayList());
        contactChange.setAddMembers(Lists.newArrayList());
        contactChange.setUpdateUsers(Lists.newArrayList());
        // Batch processing to prevent mass data operation
        CollUtil.split(allNewUserIds, 500).forEach(newUserIds -> {
            List<IdaasUserBindEntity> userBinds = idaasUserBindService.getAllByUserIdsIgnoreDeleted(newUserIds);
            Map<String, IdaasUserBindEntity> userBindMap = userBinds.stream()
                    .collect(Collectors.toMap(IdaasUserBindEntity::getUserId, v -> v, (k1, k2) -> k2));
            newUserIds.forEach(newUserId -> {
                IdaasUserBindEntity userBind = userBindMap.get(newUserId);
                if (Objects.isNull(userBind)) {
                    // 4.1 If the user binding information of IDaaS does not exist, a new user will be added
                    String userResponseStr = hashOperations.get(cacheUserItemKey, newUserId);
                    contactChange.getAddUsers().add(JSONUtil.toBean(userResponseStr, UserResponse.class));
                }
                else {
                    MemberEntity member = allMemberMap.get(userBind.getVikaUserId());
                    if (Objects.isNull(member)) {
                        // 4.2 If the space station member information does not exist, add a member
                        contactChange.getAddMembers().add(userBind);
                    }
                    else {
                        String userResponseStr = hashOperations.get(cacheUserItemKey, newUserId);
                        UserResponse userResponse = JSONUtil.toBean(userResponseStr, UserResponse.class);
                        Values userValues = userResponse.getValues();
                        Collection<String> groupIdDiff = CollUtil.disjunction(JSONUtil.toList(userBind.getGroupIds(), String.class), userValues.getGroups());
                        if (!Objects.equals(userBind.getNickName(), userValues.getDisplayName()) ||
                                !Objects.equals(userBind.getEmail(), userValues.getPrimaryMail()) ||
                                !Objects.equals(userBind.getMobile(), userValues.getPhoneNum()) ||
                                CollUtil.isNotEmpty(groupIdDiff) ||
                                Boolean.TRUE.equals(userBind.getIsDeleted())) {
                            // 3.2 If the name, mobile phone number, email address and user group of the bound user are changed or re enabled, the information needs to be updated
                            userBind.setNickName(userValues.getDisplayName());
                            userBind.setEmail(userValues.getPrimaryMail());
                            userBind.setMobile(userValues.getPhoneNum());
                            userBind.setGroupIds(JSONUtil.toJsonStr(userValues.getGroups()));
                            contactChange.getUpdateUsers().add(userBind);
                        }
                    }
                }
            });
        });
    }

    /**
     * Get the cache key of the bound user group list of the space station
     *
     * @param spaceId space ID
     * @return cache Key
     */
    private String getCacheExistedGroupKey(String spaceId) {
        return String.format(CACHE_EXISTED_GROUP, spaceId);
    }

    /**
     * Get the cache key of the latest user group list of the space station
     *
     * @param spaceId space ID
     * @return cache Key
     */
    private String getCacheNewGroupKey(String spaceId) {
        return String.format(CACHE_NEW_GROUP, spaceId);
    }

    /**
     * Get the cache key of the latest user group information of the space station
     *
     * @param spaceId space ID
     * @return cache Key
     */
    private String getCacheGroupItemKey(String spaceId) {
        return String.format(CACHE_GROUP_ITEM, spaceId);
    }

    /**
     * Get the cache key of the latest user list of the space station
     *
     * @param spaceId space ID
     * @return cache Key
     */
    private String getCacheNewUserKey(String spaceId) {
        return String.format(CACHE_NEW_USER, spaceId);
    }

    /**
     * Get the cache key of the latest user information of the space station
     *
     * @param spaceId space ID
     * @return cache Key
     */
    private String getCacheUserItemKey(String spaceId) {
        return String.format(CACHE_USER_ITEM, spaceId);
    }

}
