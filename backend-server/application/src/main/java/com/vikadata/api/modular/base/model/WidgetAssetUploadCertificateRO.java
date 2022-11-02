package com.vikadata.api.modular.base.model;

import java.util.List;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * widget file upload certificate ro
 * </p>
 *
 * @author tao
 */
@Data
@ApiModel("widget file upload certificate ro")
public class WidgetAssetUploadCertificateRO {

    @ApiModelProperty(value = "the file names， max: 20. when fileType asset, it need", position = 1)
    private List<String> filenames;

    @ApiModelProperty(value = "file type：0：asset; 1：package; 2: public", position = 2)
    @NotNull
    private Integer fileType;

    @ApiModelProperty(value = "the amount of token, max: 20. when fileType no asset, it need", position = 3)
    private Integer count;

    @ApiModelProperty(value = "the package's version. when fileType package, it need", position = 4)
    private String version;

}
