package com.vikadata.api.asset.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Resource upload result view
 * </p>
 */
@Data
@ApiModel("Resource upload result view")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AssetUploadResult {

    @ApiModelProperty(value = "File Access Path", example = "spc10/2019/12/10/159.jpg", position = 1)
    private String token;

    @ApiModelProperty(value = "Preview Path", example = "spc10/2019/12/10/159.jpg", position = 2)
    private String preview;

    @ApiModelProperty(value = "MIME Type", example = "image/pdf", position = 3)
    private String mimeType;

    @ApiModelProperty(value = "File size", example = "1204", position = 4)
    private Long size;

    @ApiModelProperty(value = "Cloud storage type", example = "QNY", position = 5)
    private String bucket;

    @ApiModelProperty(value = "Document name", example = "image.jpg", position = 5)
    private String name;

    @ApiModelProperty(value = "Picture height", example = "100", position = 6)
    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    private Integer height;

    @ApiModelProperty(value = "Image width", example = "80", position = 5)
    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    private Integer width;

    public AssetUploadResult(String token) {
        this.token = token;
    }
}
