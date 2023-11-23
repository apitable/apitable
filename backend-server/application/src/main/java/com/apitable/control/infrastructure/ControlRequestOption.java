/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.control.infrastructure;

import java.io.Serializable;

/**
 * Control Request Executor option.
 *
 * @author Shawn Deng
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
