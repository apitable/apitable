package com.vikadata.api.workspace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NodeExtraDTO {
    private Integer showRecordHistory;

    private Integer dingTalkDaStatus;

    private String dingTalkTemplateKey;

    private String sourceTemplateId;
}
