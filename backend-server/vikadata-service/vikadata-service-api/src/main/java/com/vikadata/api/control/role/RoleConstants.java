package com.vikadata.api.control.role;

/**
 * 角色定义
 * @author Shawn Deng
 * @date 2021-03-18 17:17:17
 */
public interface RoleConstants {

    interface Node {

        String READER = "reader";
        String EDITOR = "editor";
        String MANAGER = "manager";
        String UPDATER = "updater";
        String OWNER = "owner";
        String ANONYMOUS = "anonymous";
        String FOREIGNER = "foreigner";
        String TEMPLATE_VISITOR = "templateVisitor";
    }

    interface Field {
        String READER = "reader";
        String EDITOR = "editor";
    }
}
