package com.vikadata.api.model.dto.node;

import lombok.Data;

/**
 * <p>
 * 节点分享信息对象
 * </p>
 *
 * @author Chambers
 * @date 2020/10/12
 */
@Data
public class NodeShareDTO {

    private String nodeId;

    private String shareId;

    private String spaceId;

    private Long operator;
}
