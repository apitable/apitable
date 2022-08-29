package com.vikadata.api.modular.workspace.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 创建节点操作对象
 * </p>
 *
 * @author Chambers
 * @date 2019/11/12
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class CreateNodeDto {

    /**
     * 空间ID
     */
    private String spaceId;

    /**
     * 父节点ID
     */
    private String parentId;

    /**
     * 名称
     */
    private String nodeName;

    /**
     * 节点类型
     */
    private Integer type;

    /**
     * 前一个节点ID
     */
    private String preNodeId;

    /**
     * 新节点ID
     */
    private String newNodeId;

    /**
     * 节点图标
     */
    private String icon;

    /**
     * 封面图TOKEN
     */
    private String cover;

    /**
     * 其他信息
     */
    private String extra;
}
