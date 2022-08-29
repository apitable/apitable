package com.vikadata.api.modular.workspace.model;

import lombok.Data;

/**
 * <p>
 * 用户对应节点角色视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/2 15:18
 */
@Data
public class NodePermissionDTO {

    private String nodeId;

    private String role;

    private Long unitId;
}
