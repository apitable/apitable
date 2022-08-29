package com.vikadata.api.modular.workspace.model;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * <p>
 * 节点拷贝选项
 * 1. 是否拷贝数据
 * 2. 拷贝节点的后缀
 * 3. 是否目标节点下方
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/26 17:10
 */
@Data
@AllArgsConstructor
@Builder(toBuilder = true)
public class NodeCopyOptions implements Serializable {

    /**
     * 是否拷贝节点的数据
     */
    protected boolean copyData;

    /**
     * 是否在关联表增加一列
     */
    private boolean addColumn;

    /**
     * 是否保留 RecordMeta
     */
    private boolean retainRecordMeta;

    /**
     * 是否校验节点数
     */
    private boolean verifyNodeCount;

    /**
     * 是否是生成为模板
     */
    private boolean template;

    /**
     * 指定过滤、不复制的节点ID 集合
     */
    private List<String> filterNodeIds;

    /**
     * 是否过滤开启列权限的字段
     */
    private boolean filterPermissionField;

    /**
     * 数表及对应开启列权限的字段集
     */
    private Map<String, List<String>> dstPermissionFieldsMap;

    /**
     * 提前生成的的节点ID，用于异步任务
     */
    private String nodeId;

    /**
     * 指定生成的节点名称
     */
    private String nodeName;

    /**
     * 钉钉搭--模版ID
     */
    private String dingTalkDaTemplateKey;

    /**
     * 来源templateId
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
