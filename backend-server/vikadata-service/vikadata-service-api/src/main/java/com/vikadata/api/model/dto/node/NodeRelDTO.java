package com.vikadata.api.model.dto.node;

import lombok.Data;

/**
 * <p>
 * 节点关联表DTO
 * </p>
 *
 * @author Chambers
 * @date 2021/7/19
 */
@Data
public class NodeRelDTO {

    /**
     * 节点类型
     */
    private Integer type;

    /**
     * 关联节点ID
     */
    private String relNodeId;

    /**
     * 其他信息
     */
    private String extra;
}
