package com.vikadata.api.modular.workspace.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p> 
 * 节点额外信息
 * </p> 
 * @author zoe zheng 
 * @date 2021/12/10 3:57 PM
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NodeExtraDTO {
    private Integer showRecordHistory;

    private Integer dingTalkDaStatus;

    private String dingTalkTemplateKey;

    private String sourceTemplateId;
}
