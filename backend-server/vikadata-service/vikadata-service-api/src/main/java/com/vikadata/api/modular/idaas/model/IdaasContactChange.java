package com.vikadata.api.modular.idaas.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

import com.vikadata.entity.IdaasGroupBindEntity;
import com.vikadata.entity.IdaasUserBindEntity;
import com.vikadata.integration.idaas.model.GroupsResponse.GroupResponse;
import com.vikadata.integration.idaas.model.UsersResponse.UserResponse;

/**
 * <p>
 * 玉符 IDaaS 通讯录变更内容
 * </p>
 * @author 刘斌华
 * @date 2022-06-04 09:29:02
 */
@Setter
@Getter
public class IdaasContactChange {

    /**
     * 添加用户组
     */
    private List<GroupResponse> addGroups;

    /**
     * 更新用户组
     */
    private List<IdaasGroupBindEntity> updateGroups;

    /**
     * 删除用户组
     */
    private List<IdaasGroupBindEntity> deleteGroups;

    /**
     * 添加用户
     */
    private List<UserResponse> addUsers;

    /**
     * 添加成员
     */
    private List<IdaasUserBindEntity> addMembers;

    /**
     * 更新用户
     */
    private List<IdaasUserBindEntity> updateUsers;

    /**
     * 删除成员
     */
    private List<Long> deleteMemberIds;

}
