package com.vikadata.api.asset.vo;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
* <p>
* Attachment audit result vo
* </p>
*/
@Data
@ApiModel("Attachment audit result vo")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AssetsAuditVo {

    /**
     * Resource ID(Relate#vika_asset#id)
     */
    private Long assetId;

    /**
     * Cloud file storage path
     */
    private String assetFileUrl;

    /**
     * [Redundancy] md 5 Summary
     */
    private String assetChecksum;

    /**
     * Audit result score
     */
    private float auditResultScore;


    /**
     * Suggestions on audit results, including:[“block”,”review”,”pass”]
     */
    private String auditResultSuggestion;

    /**
     * Audit Type, currently supports:pul[Pornographic]/terror[Violent phobia]/politician[Sensitive person]/ads[Image advertisement recognition]
     */
    private String auditScenes;


    /**
     * Reviewer Open Id
     */
    private String auditorOpenid;

    /**
     * Name of reviewer
     */
    private String auditorName;

    /**
     * Approve or not (0: No, 1: Yes)
     */
    private Boolean isAudited;

}
