package com.vikadata.api.model.dto.node;

import lombok.Data;

/**
 * <p>
 * 节点基本信息
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/10/15 15:34
 */
@Data
public class NodeBaseInfoDTO {

    private String nodeId;

    private String nodeName;

    private String icon;

    private String parentId;

    private Integer type;
}
