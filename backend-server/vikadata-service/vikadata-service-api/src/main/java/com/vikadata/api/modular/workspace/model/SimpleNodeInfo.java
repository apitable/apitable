package com.vikadata.api.modular.workspace.model;

import lombok.Data;

/**
 * <p>
 * 节点
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/5/7 10:42
 */
@Data
public class SimpleNodeInfo {

    private String nodeId;

    private String parentId;

    private Boolean extend;
}
