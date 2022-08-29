package com.vikadata.api.model.ro.asset;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

/**
* <p>
* 附件审核结果ro
* </p>
*
* @author Benson Cheung
* @date 2020/03/23
*/
@Data
@ApiModel("附件人工审核结果ro")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AssetsAuditOpRo {

    /**
     * 云端文件存放路径
     */
    @NotBlank(message = "云端文件存放路径")
    @ApiModelProperty(value = "云端文件存放路径", example = "space/2020/03/27/1243592950910349313", position = 1)
    private String assetFileUrl;


    @NotBlank(message = "审核结果建议，包括：[“block”,”review”,”pass”]")
    @ApiModelProperty(value = "资源审核结果建议", example = "block", position = 2)
    private String auditResultSuggestion;

}
