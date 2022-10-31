package com.vikadata.api.modular.workspace.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class NodeCopyEffectDTO {

    private String nodeId;

    private String copyNodeId;

    private List<String> linkFieldIds;
}
