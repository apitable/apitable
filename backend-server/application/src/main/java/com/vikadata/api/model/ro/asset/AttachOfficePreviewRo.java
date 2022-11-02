package com.vikadata.api.model.ro.asset;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
* <p>
* 附件预览请求参数ro
* </p>
*
* @author Benson Cheung
* @date 2021/04/08
*/
@Data
@ApiModel("附件预览请求参数ro")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AttachOfficePreviewRo {

    /**
     * 云端文件存放路径
     */
    @NotBlank(message = "云端文件存放路径")
    @ApiModelProperty(value = "云端文件名/key", example = "space/2020/03/27/1243592950910349313", position = 1)
    private String token;


    @NotBlank(message = "云端文件的源文件名称和后缀")
    @ApiModelProperty(value = "云端文件的源文件名称和后缀", example = "Leida团队书籍.xls", position = 2)
    private String attname;

}
