package com.vikadata.api.control;

import java.io.Serializable;

/**
 * 控制权限请求选项
 * @author Shawn Deng
 * @date 2021-04-01 17:17:01
 */
public class ControlRequestOption implements Serializable {

    private static final long serialVersionUID = -2590606512902541554L;

    protected boolean nodeTreeRoleBuilding;

    protected boolean shareNodeTreeRoleBuilding;

    protected boolean rubbishRoleBuilding;

    protected boolean internalBuilding;

    public static ControlRequestOption create() {
        return new ControlRequestOption();
    }

    public ControlRequestOption() {
    }

    public ControlRequestOption setNodeTreeRoleBuilding(boolean nodeTreeRoleBuilding) {
        this.nodeTreeRoleBuilding = nodeTreeRoleBuilding;
        return this;
    }

    public ControlRequestOption setShareNodeTreeRoleBuilding(boolean shareNodeTreeRoleBuilding) {
        this.shareNodeTreeRoleBuilding = shareNodeTreeRoleBuilding;
        return this;
    }

    public ControlRequestOption setRubbishRoleBuilding(boolean rubbishRoleBuilding) {
        this.rubbishRoleBuilding = rubbishRoleBuilding;
        return this;
    }

    public ControlRequestOption setInternalBuilding(boolean internalBuilding) {
        this.internalBuilding = internalBuilding;
        return this;
    }
}
