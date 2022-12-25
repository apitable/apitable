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

package com.apitable.workspace.enums;

/**
 * node type
 *
 */
public enum NodeType {

    /**
     * root node
     */
    ROOT(0),

    /**
     * folder
     */
    FOLDER(1),

    /**
     * datasheet
     */
    DATASHEET(2),

    /**
     * form
     */
    FORM(3),

    /**
     * dashboard
     */
    DASHBOARD(4),

    /**
     * mirror
     */
    MIRROR(5),

    /**
     * dataPage, Page design based on
     */
    DATAPAGE(6),

    /**
     * canvas
     */
    CANVAS(7),

    /**
     * editor documents
     */
    WORD_DOC(8),

    /**
     * static resource file
     */
    ASSET_FILE(98),

    /**
     * dataDoc
     */
    DATADOC(99);


    private int nodeType;

    NodeType(int nodeType) {
        this.nodeType = nodeType;
    }

    public int getNodeType() {
        return nodeType;
    }

    public void setNodeType(int nodeType) {
        this.nodeType = nodeType;
    }

    public static NodeType toEnum(int code) {
        for (NodeType e : NodeType.values()) {
            if (e.getNodeType() == code) {
                return e;
            }
        }
        throw new RuntimeException("unknown node type");
    }

    /**
     * exclude root and folder type
     */
    public boolean isFileNode() {
        return nodeType > 1;
    }
}
