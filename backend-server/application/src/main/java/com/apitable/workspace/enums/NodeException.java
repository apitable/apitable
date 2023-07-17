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

import com.apitable.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Node Exception
 * status code range（410-429）.
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum NodeException implements BaseException {

    NOT_ALLOW(410, "root node operation not allowed"),

    UNKNOWN_NODE_TYPE(411, "unknown node type"),

    MOVE_FAILURE(413, "failed to move"),

    SHARE_NODE_STORE_FAIL(414, "failed to transfer"),

    SHARE_NODE_DISABLE_SAVE(414, "sharing nodes are not allowed to transfer"),

    SHARE_EXPIRE(414, "share link not working"),

    OPEN_SHARE_ERROR(415, "failed to enable share"),

    CLOSE_SHARE_ERROR(415, "failed to close sharing"),

    ROOT_NODE_CAN_NOT_SHARE(417, "the root node is not allowed to share"),

    NODE_COPY_FOLDER_ERROR(418, "Can't copy folder"),

    DESCRIPTION_TOO_LONG(419, "description is too long"),

    LINK_DATASHEET_COLUMN_EXCEED_LIMIT(420,
        "The fields of the associated table will exceed the 200-column limit, and the replication fails"),

    RUBBISH_NODE_NOT_EXIST(422, "the node does not exist in the recycle bin"),

    FAVORITE_NODE_NOT_EXIST(423, "The node or predecessor node does not exist in the star"),

    COPY_NODE_LINK__FIELD_ERROR(424, "Replication node, replication of associated columns failed"),

    DELETE_NODE_LINK__FIELD_ERROR(425,
        "Deleting a node, transforming the associated column failed"),
    DUPLICATE_NODE_NAME(426, "duplicate node name"),
    NODE_CREATE_LOST_PARAMS(427, "lost necessary parameter for create node");

    private final Integer code;

    private final String message;
}
