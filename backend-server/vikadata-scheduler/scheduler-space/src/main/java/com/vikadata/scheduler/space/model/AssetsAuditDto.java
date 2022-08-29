package com.vikadata.scheduler.space.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
* <p>
* 附件审核结果vo
* </p>
*
* @author Benson Cheung
* @date 2020/03/23
*/
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AssetsAuditDto {

    /**
     * 资源ID(关联#vika_asset#id)
     */
    private Long assetId;

    /**
     * 云端文件存放路径
     */
    private String assetFileUrl;

    /**
     * [冗余]md5摘要
     */
    private String assetChecksum;

    /**
     * 审核结果分数
     */
    private float auditResultScore;


    /**
     * 审核结果建议，包括：[“block”,”review”,”pass”]
     */
    private String auditResultSuggestion;

    /**
     * 审核类型，目前支持：pul[色情]/terror[暴恐]/politician[敏感人物]/ads[图片广告识别]
     */
    private String auditScenes;


    /**
     * 审核人OpenId
     */
    private String auditorOpenid;

    /**
     * 审核人名称
     */
    private String auditorName;

    /**
     * 是否审核(0:否,1:是)
     */
    private Boolean isAudited;

}
