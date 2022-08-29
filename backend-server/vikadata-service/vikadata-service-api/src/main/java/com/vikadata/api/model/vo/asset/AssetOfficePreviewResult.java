package com.vikadata.api.model.vo.asset;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * office文档预览结果视图
 * </p>
 *
 * @author Benson Cheung
 * @date 2020/3/22 15:39
 */
@Data
@ApiModel("office文档预览结果视图")
public class AssetOfficePreviewResult {

    @ApiModelProperty(value = "转换后的预览地址", example = "{'data': 'http://xxx'}", position = 1)
    private Data data;

    @ApiModelProperty(value = "返回结果的信息提示", example = "操作成功", position = 2)
    private String message;

    @ApiModelProperty(value = "code", example = "0", position = 3)
    @JsonProperty("errorcode")
    private Integer errorCode;

    @Setter
    @Getter
    public static class Data {
        private String data;
    }

}
