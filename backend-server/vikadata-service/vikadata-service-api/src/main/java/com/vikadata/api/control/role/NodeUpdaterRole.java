package com.vikadata.api.control.role;

import com.vikadata.api.control.permission.NodePermission;

/**
 * <p>
 * 更新者角色
 * <p>
 *
 * @author liuzijing
 * @date 2022/07/06
 */
public class NodeUpdaterRole extends NodeReaderRole{

    public NodeUpdaterRole() {
        this(false);
    }

    public NodeUpdaterRole(boolean inherit){
        super(inherit);

        permissions.add(NodePermission.EDIT_CELL);
    }

    @Override
    public String getRoleTag(){
        return RoleConstants.Node.UPDATER;
    }
}
