package com.vikadata.api.modular.workspace.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p> 
 * 节点复制 收集器
 * </p> 
 * @author zoe zheng 
 * @date 2021/3/31 4:54 下午
 */
@Data
@Builder
public class NodeCopyEffectDTO {

    private String nodeId;

    private String copyNodeId;

    private List<String> linkFieldIds;
}
