package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * Node Exception
 * status code range（410-429）
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

    LINK_DATASHEET_COLUMN_EXCEED_LIMIT(420, "The fields of the associated table will exceed the 200-column limit, and the replication fails"),

    RUBBISH_NODE_NOT_EXIST(422, "the node does not exist in the recycle bin"),

    FAVORITE_NODE_NOT_EXIST(423, "The node or predecessor node does not exist in the star"),

    COPY_NODE_LINK__FIELD_ERROR(424, "Replication node, replication of associated columns failed"),

    DELETE_NODE_LINK__FIELD_ERROR(425, "Deleting a node, transforming the associated column failed");

    private final Integer code;

    private final String message;
}
