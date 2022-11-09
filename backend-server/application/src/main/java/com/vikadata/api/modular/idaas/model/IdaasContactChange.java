package com.vikadata.api.modular.idaas.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

import com.apitable.starter.idaas.core.model.GroupsResponse.GroupResponse;
import com.apitable.starter.idaas.core.model.UsersResponse.UserResponse;
import com.vikadata.entity.IdaasGroupBindEntity;
import com.vikadata.entity.IdaasUserBindEntity;

/**
 * <p>
 * IDaaS Address book changes
 * </p>
 */
@Setter
@Getter
public class IdaasContactChange {

    /**
     * add user group
     */
    private List<GroupResponse> addGroups;

    /**
     * update user group
     */
    private List<IdaasGroupBindEntity> updateGroups;

    /**
     * delete user group
     */
    private List<IdaasGroupBindEntity> deleteGroups;

    /**
     * add users
     */
    private List<UserResponse> addUsers;

    /**
     * add members
     */
    private List<IdaasUserBindEntity> addMembers;

    /**
     * updater users
     */
    private List<IdaasUserBindEntity> updateUsers;

    /**
     * delete members
     */
    private List<Long> deleteMemberIds;

}
