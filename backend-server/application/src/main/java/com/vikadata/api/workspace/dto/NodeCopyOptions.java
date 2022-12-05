package com.vikadata.api.workspace.dto;

import java.io.Serializable;
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
     * whether to copy node data
     */
    protected boolean copyData;

    /**
     * whether to add a column to the association table
     */
    private boolean addColumn;

    /**
     * whether keep RecordMeta
     */
    private boolean retainRecordMeta;

    /**
     * whether to check the number of nodes
     */
    private boolean verifyNodeCount;

    /**
     * is it a template
     */
    private boolean template;

    /**
     * specify the ids of the node that is filtered and not copied.
     */
    private List<String> filterNodeIds;

    /**
     * whether to filter fields that enable column permissions
     */
    private boolean filterPermissionField;

    /**
     * the datasheet and the fields which the column permission is enabled.
     */
    private Map<String, List<String>> dstPermissionFieldsMap;

    /**
     * node id generated in advance for asynchronous tasks
     */
    private String nodeId;

    /**
     * specify the generated node name
     */
    private String nodeName;

    /**
     * dingtalk--teamplate id
     */
    private String dingTalkDaTemplateKey;

    /**
     * source templateId
     */
    private String sourceTemplateId;

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
