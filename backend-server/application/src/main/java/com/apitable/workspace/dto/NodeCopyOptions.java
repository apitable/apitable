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

package com.apitable.workspace.dto;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * <p>
 * node copy options
 * 1. whether to copy data
 * 2. copy the suffix of the node
 * 3. whether below the target node
 * </p>
 */
@Data
@AllArgsConstructor
@Builder(toBuilder = true)
public class NodeCopyOptions implements Serializable {

    /**
     * whether to copy node data.
     */
    protected boolean copyData;

    /**
     * whether to add a column to the association table.
     */
    private boolean addColumn;

    /**
     * whether keep RecordMeta.
     */
    private boolean retainRecordMeta;

    /**
     * whether to check the number of nodes.
     */
    private boolean verifyNodeCount;

    /**
     * is it a template.
     */
    private boolean template;

    /**
     * specify the ids of the node that is filtered and not copied.
     */
    private List<String> filterNodeIds;

    /**
     * whether to filter fields that enable column permissions.
     */
    private boolean filterPermissionField;

    /**
     * the datasheet and the fields which the column permission is enabled.
     */
    private Map<String, List<String>> dstPermissionFieldsMap;

    /**
     * node id generated in advance for asynchronous tasks.
     */
    private String nodeId;

    /**
     * specify the generated node name.
     */
    private String nodeName;

    /**
     * dingtalk--teamplate id.
     */
    private String dingTalkDaTemplateKey;

    /**
     * source templateId.
     */
    private String sourceTemplateId;

    /**
     * new trigger id map.
     */
    private Map<String, String> newTriggerMap = new HashMap<>();

    /**
     * unit id.
     */
    private String unitId;

    public NodeCopyOptions() {
        this.copyData = true;
    }

    public static NodeCopyOptions create() {
        return new NodeCopyOptions();
    }

    public static NodeCopyOptions create(boolean copyData, boolean addColumn) {
        return new NodeCopyOptions(copyData, addColumn);
    }

    public NodeCopyOptions(boolean copyData, boolean addColumn) {
        this.copyData = copyData;
        this.addColumn = addColumn;
    }
}
