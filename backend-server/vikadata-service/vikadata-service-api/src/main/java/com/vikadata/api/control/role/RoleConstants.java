package com.vikadata.api.control.role;

/**
 * Role Constants
 * @author Shawn Deng
 */
public interface RoleConstants {

    interface Node {

        String READER = "reader";

        String EDITOR = "editor";

        String MANAGER = "manager";

        String UPDATER = "updater";

        String OWNER = "owner";

        String ANONYMOUS = "anonymous";

        String TEMPLATE_VISITOR = "templateVisitor";
    }

    interface Field {
        String READER = "reader";

        String EDITOR = "editor";
    }
}
