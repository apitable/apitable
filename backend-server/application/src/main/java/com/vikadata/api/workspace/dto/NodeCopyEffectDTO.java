package com.vikadata.api.workspace.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NodeCopyEffectDTO {

    private String nodeId;

    private String copyNodeId;

    private List<String> linkFieldIds;
}
