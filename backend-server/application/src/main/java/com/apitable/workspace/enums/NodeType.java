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
 * node type.
 */
public enum NodeType {

    /**
     * root node.
     */
    ROOT(0),

    /**
     * folder.
     */
    FOLDER(1),

    /**
     * datasheet.
     */
    DATASHEET(2),

    /**
     * form.
     */
    FORM(3),

    /**
     * dashboard.
     */
    DASHBOARD(4),

    /**
     * mirror.
     */
    MIRROR(5),

    /**
     * dataPage, Page design based on.
     */
    DATAPAGE(6),

    /**
     * canvas.
     */
    CANVAS(7),

    /**
     * editor documents.
     */
    WORD_DOC(8),

    /**
     * ai chat bot.
     */
    AI_CHAT_BOT(9),

    /**
     * automation.
     */
    AUTOMATION(10),

    /**
     * airagent. NOTICE: Airagent will not create `node`, here is just for ID Generating
     */
    AIRAGENT(11),

    /**
     * custom page.
     */
    CUSTOM_PAGE(12),

    /**
     * static resource file.
     */
    ASSET_FILE(98),

    /**
     * dataDoc.
     */
    DATADOC(99);


    private final int value;

    NodeType(int value) {
        this.value = value;
    }

    public int getNodeType() {
        return value;
    }

    /**
     * transform from.
     *
     * @param code code value
     * @return NodeType
     */
    public static NodeType toEnum(int code) {
        for (NodeType e : NodeType.values()) {
            if (e.getNodeType() == code) {
                return e;
            }
        }
        throw new RuntimeException("unknown node type");
    }

    /**
     * whether is root node type.
     *
     * @return true if is root
     */
    public boolean isRoot() {
        return this == ROOT;
    }

    /**
     * whether is folder node type.
     *
     * @return true if is folder
     */
    public boolean isFolder() {
        return this == FOLDER;
    }

    /**
     * whether is not folder node type.
     *
     * @return true if is not folder
     */
    public boolean isNotFolder() {
        return !isRoot() && !isFolder();
    }
}
