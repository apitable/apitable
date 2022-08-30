package com.vikadata.api.model.vo.asset;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 资源上传结果视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/6/3 15:39
 */
@Data
@ApiModel("资源上传结果视图")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AssetUploadResult {

    @ApiModelProperty(value = "文件访问路径", example = "spc10/2019/12/10/159.jpg", position = 1)
    private String token;

    @ApiModelProperty(value = "预览图路径", example = "spc10/2019/12/10/159.jpg", position = 2)
    private String preview;

    @ApiModelProperty(value = "MIME类型", example = "image/pdf", position = 3)
    private String mimeType;

    @ApiModelProperty(value = "文件大小", example = "1204", position = 4)
    private Long size;

    @ApiModelProperty(value = "云存储类型", example = "QNY", position = 5)
    private String bucket;

    @ApiModelProperty(value = "文件名称", example = "image.jpg", position = 5)
    private String name;

    @ApiModelProperty(value = "图片高度", example = "100", position = 6)
    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    private Integer height;

    @ApiModelProperty(value = "图片宽度", example = "80", position = 5)
    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    private Integer width;

    public AssetUploadResult(String token) {
        this.token = token;
    }
}
