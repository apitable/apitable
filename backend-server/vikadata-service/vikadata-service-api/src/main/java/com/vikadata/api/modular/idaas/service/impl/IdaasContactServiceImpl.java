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
import com.vikadata.integration.idaas.IdaasApiException;
import com.vikadata.integration.idaas.IdaasTemplate;
import com.vikadata.integration.idaas.api.GroupApi;
import com.vikadata.integration.idaas.api.UserApi;
import com.vikadata.integration.idaas.model.GroupsRequest;
import com.vikadata.integration.idaas.model.GroupsResponse;
import com.vikadata.integration.idaas.model.GroupsResponse.GroupResponse;
import com.vikadata.integration.idaas.model.UsersRequest;
import com.vikadata.integration.idaas.model.UsersResponse;
import com.vikadata.integration.idaas.model.UsersResponse.UserResponse;
import com.vikadata.integration.idaas.model.UsersResponse.UserResponse.Values;
import com.vikadata.integration.idaas.support.ServiceAccount;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import static com.vikadata.api.config.AsyncTaskExecutorConfig.DEFAULT_EXECUTOR_BEAN_NAME;

/**
 * <p>
 * 玉符 IDaaS 通讯录
 * </p>
 * @author 刘斌华
 * @date 2022-05-17 14:28:02
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

        // 1 将空间站设置为正在同步状态
        spaceService.setContactSyncing(spaceId, tenantEntity.getTenantName());
        try {
            ServiceAccount serviceAccount = JSONUtil.toBean(tenantEntity.getServiceAccount(), ServiceAccount.class);
            IdaasContactChange contactChange = new IdaasContactChange();
            // 2 获取组织结构
            fetchGroups(tenantEntity.getTenantName(), serviceAccount, spaceId, contactChange);
            // 3 获取成员
            fetchUsers(tenantEntity.getTenantName(), serviceAccount, spaceId, contactChange);
            // 4 保存变更信息
            idaasContactChangeService.saveContactChange(tenantEntity.getTenantName(), spaceId, contactChange);
        }
        catch (IdaasApiException ex) {
            log.error("Exception occurred while executing contact api.", ex);

            throw new BusinessException(IdaasException.API_ERROR);
        }
        finally {
            // 5 清空临时缓存
            stringRedisTemplate.delete(Arrays.asList(
                    getCacheExistedGroupKey(spaceId),
                    getCacheNewGroupKey(spaceId),
                    getCacheGroupItemKey(spaceId),
                    getCacheNewUserKey(spaceId),
                    getCacheUserItemKey(spaceId)
            ));
            // 6 解除空间站的正在同步状态
            spaceService.contactFinished(spaceId);
        }
    }

    /**
     * 获取并处理用户组信息
     *
     * @param tenantName 租户名
     * @param serviceAccount 租户级 ServiceAccount
     * @param spaceId 绑定的空间站
     * @param contactChange 变更信息
     * @author 刘斌华
     * @date 2022-06-04 17:10:50
     */
    private void fetchGroups(String tenantName, ServiceAccount serviceAccount, String spaceId, IdaasContactChange contactChange) throws IdaasApiException {
        String cacheExistedGroupKey = getCacheExistedGroupKey(spaceId);
        String cacheNewGroupKey = getCacheNewGroupKey(spaceId);
        String cacheGroupItemKey = getCacheGroupItemKey(spaceId);
        SetOperations<String, String> setOperations = stringRedisTemplate.opsForSet();
        HashOperations<String, String, String> hashOperations = stringRedisTemplate.opsForHash();
        // 1 获取最新的用户组信息，并加入缓存
        GroupApi groupApi = idaasTemplate.getGroupApi();
        GroupsRequest groupsRequest = new GroupsRequest();
        groupsRequest.setPageIndex(0);
        groupsRequest.setPageSize(500);
        groupsRequest.setOrderBy(Arrays.asList("_udOrder", "_createdOn"));
        GroupsResponse groupsResponse = groupApi.groups(groupsRequest, serviceAccount, tenantName);
        List<GroupResponse> groupResponses = groupsResponse.getData();
        AtomicInteger order = new AtomicInteger(0);
        while (CollUtil.isNotEmpty(groupResponses)) {
            // 1.1 将最新的用户组信息缓存起来
            groupResponses.forEach(groupResponse -> {
                // 将列表返回的顺序作为组织结构的排序
                groupResponse.setOrder(order.incrementAndGet());

                setOperations.add(cacheNewGroupKey, groupResponse.getId());
                hashOperations.put(cacheGroupItemKey, groupResponse.getId(), JSONUtil.toJsonStr(groupResponse));
            });

            groupsRequest.setPageIndex(groupsRequest.getPageIndex() + 1);
            groupsResponse = groupApi.groups(groupsRequest, serviceAccount, tenantName);
            groupResponses = groupsResponse.getData();
        }
        // 2 获取所有已绑定的用户组信息
        List<IdaasGroupBindEntity> groupBinds = idaasGroupBindService.getAllBySpaceIdIgnoreDeleted(spaceId);
        if (CollUtil.isNotEmpty(groupBinds)) {
            // 2.1 将已绑定的用户组加入缓存
            String[] bindGroupIds = groupBinds.stream()
                    .map(IdaasGroupBindEntity::getGroupId)
                    .toArray(String[]::new);
            setOperations.add(cacheExistedGroupKey, bindGroupIds);
        }
        // 3 遍历所有已绑定的用户组信息，获取需要更新、删除的用户组
        contactChange.setUpdateGroups(Lists.newArrayList());
        contactChange.setDeleteGroups(Lists.newArrayList());
        groupBinds.forEach(groupBind -> {
            String groupResponseStr = hashOperations.get(cacheGroupItemKey, groupBind.getGroupId());
            GroupResponse groupResponse = Optional.ofNullable(groupResponseStr)
                    .filter(CharSequenceUtil::isNotBlank)
                    .map(str -> JSONUtil.toBean(str, GroupResponse.class))
                    .orElse(null);
            if (Objects.isNull(groupResponse)) {
                // 3.1 已绑定的用户组在最新列表中不存在，则需要删除
                contactChange.getDeleteGroups().add(groupBind);
            }
            else if (!Objects.equals(groupBind.getGroupName(), groupResponse.getName()) ||
                    !Objects.equals(groupBind.getGroupOrder(), groupResponse.getOrder()) ||
                    Boolean.TRUE.equals(groupBind.getIsDeleted())) {
                // 3.2 如果已绑定的用户组的名称、排序发生了变更或者重新启用，则需要更新信息
                groupBind.setGroupName(groupResponse.getName());
                groupBind.setGroupOrder(groupResponse.getOrder());
                contactChange.getUpdateGroups().add(groupBind);
            }
        });

        // 4 获取需要新增的用户组
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
     * 获取并处理用户信息
     *
     * @param tenantName 租户名
     * @param serviceAccount 租户级 ServiceAccount
     * @param spaceId 绑定的空间站
     * @param contactChange 变更信息
     * @author 刘斌华
     * @date 2022-06-04 17:10:50
     */
    private void fetchUsers(String tenantName, ServiceAccount serviceAccount, String spaceId, IdaasContactChange contactChange) throws IdaasApiException {
        String cacheNewUserKey = getCacheNewUserKey(spaceId);
        String cacheUserItemKey = getCacheUserItemKey(spaceId);
        SetOperations<String, String> setOperations = stringRedisTemplate.opsForSet();
        HashOperations<String, String, String> hashOperations = stringRedisTemplate.opsForHash();
        // 1 获取最新的用户信息，并加入缓存
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
            // 1.1 将最新的用户信息缓存起来
            userResponses.forEach(userResponse -> {
                setOperations.add(cacheNewUserKey, userResponse.getId());
                hashOperations.put(cacheUserItemKey, userResponse.getId(), JSONUtil.toJsonStr(userResponse));
            });

            usersRequest.setPageIndex(usersRequest.getPageIndex() + 1);
            usersResponse = userApi.users(usersRequest, serviceAccount, tenantName);
            userResponses = usersResponse.getData();
        }
        // 2 获取所有 IDaaS 对应的维格用户信息
        Set<String> allNewUserIds = setOperations.members(cacheNewUserKey);
        // 3 获取空间站已绑定的成员信息
        List<MemberEntity> allMembers = memberService.getMembersBySpaceId(spaceId, true);
        Map<Long, MemberEntity> allMemberMap = allMembers.stream()
                .collect(Collectors.toMap(MemberEntity::getUserId, v -> v, (k1, k2) -> k2));
        // 3.1 遍历所有成员，获取需要删除的成员
        contactChange.setDeleteMemberIds(Lists.newArrayList());
        // 分批处理，防止大批量数据操作
        CollUtil.split(allMembers, 500).forEach(members -> {
            List<Long> vikaUserIds = members.stream()
                    .map(MemberEntity::getUserId)
                    .collect(Collectors.toList());
            List<IdaasUserBindEntity> userBinds = idaasUserBindService.getAllByVikaUserIdsIgnoreDeleted(vikaUserIds);
            userBinds.forEach(userBind -> {
                MemberEntity member = allMemberMap.get(userBind.getVikaUserId());
                if (!CollUtil.contains(allNewUserIds, userBind.getUserId()) && Boolean.FALSE.equals(member.getIsDeleted())) {
                    // 3.2 如果已绑定成员不在新的用户列表中，则需要删除
                    contactChange.getDeleteMemberIds().add(member.getId());
                }
            });
        });
        // 4 遍历所有 IDaaS 用户，获取需要新增、更新的信息
        contactChange.setAddUsers(Lists.newArrayList());
        contactChange.setAddMembers(Lists.newArrayList());
        contactChange.setUpdateUsers(Lists.newArrayList());
        // 分批处理，防止大批量数据操作
        CollUtil.split(allNewUserIds, 500).forEach(newUserIds -> {
            List<IdaasUserBindEntity> userBinds = idaasUserBindService.getAllByUserIdsIgnoreDeleted(newUserIds);
            Map<String, IdaasUserBindEntity> userBindMap = userBinds.stream()
                    .collect(Collectors.toMap(IdaasUserBindEntity::getUserId, v -> v, (k1, k2) -> k2));
            newUserIds.forEach(newUserId -> {
                IdaasUserBindEntity userBind = userBindMap.get(newUserId);
                if (Objects.isNull(userBind)) {
                    // 4.1 IDaaS 的用户绑定信息不存在，则新增用户
                    String userResponseStr = hashOperations.get(cacheUserItemKey, newUserId);
                    contactChange.getAddUsers().add(JSONUtil.toBean(userResponseStr, UserResponse.class));
                }
                else {
                    MemberEntity member = allMemberMap.get(userBind.getVikaUserId());
                    if (Objects.isNull(member)) {
                        // 4.2 空间站成员信息不存在，则新增成员
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
                            // 3.2 如果已绑定的用户的名称、手机号码、邮箱、用户组发生了变更或者重新启用，则需要更新信息
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
     * 获取空间站已绑定用户组列表的缓存 Key
     *
     * @param spaceId 空间站 ID
     * @return 缓存 Key
     * @author 刘斌华
     * @date 2022-05-30 15:51:57
     */
    private String getCacheExistedGroupKey(String spaceId) {
        return String.format(CACHE_EXISTED_GROUP, spaceId);
    }

    /**
     * 获取空间站最新用户组列表的缓存 Key
     *
     * @param spaceId 空间站 ID
     * @return 缓存 Key
     * @author 刘斌华
     * @date 2022-05-30 15:51:57
     */
    private String getCacheNewGroupKey(String spaceId) {
        return String.format(CACHE_NEW_GROUP, spaceId);
    }

    /**
     * 获取空间站最新用户组信息的缓存 Key
     *
     * @param spaceId 空间站 ID
     * @return 缓存 Key
     * @author 刘斌华
     * @date 2022-05-30 15:51:57
     */
    private String getCacheGroupItemKey(String spaceId) {
        return String.format(CACHE_GROUP_ITEM, spaceId);
    }

    /**
     * 获取空间站最新用户列表的缓存 Key
     *
     * @param spaceId 空间站 ID
     * @return 缓存 Key
     * @author 刘斌华
     * @date 2022-05-30 15:51:57
     */
    private String getCacheNewUserKey(String spaceId) {
        return String.format(CACHE_NEW_USER, spaceId);
    }

    /**
     * 获取空间站最新用户信息的缓存 Key
     *
     * @param spaceId 空间站 ID
     * @return 缓存 Key
     * @author 刘斌华
     * @date 2022-05-30 15:51:57
     */
    private String getCacheUserItemKey(String spaceId) {
        return String.format(CACHE_USER_ITEM, spaceId);
    }

}
