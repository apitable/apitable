package com.vikadata.api.model.vo.vcode;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * V码兑换券模板视图
 * </p>
 *
 * @author Chambers
 * @date 2020/8/15
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("V码兑换券模板视图")
public class VCodeCouponVo {

    @ApiModelProperty(value = "兑换券模板ID", dataType = "java.lang.String", example = "1456", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long templateId;

    @ApiModelProperty(value = "兑换数", dataType = "java.lang.Integer", example = "10", position = 2)
    private Integer count;

    @ApiModelProperty(value = "备注", dataType = "java.lang.String", example = "种子用户福利兑换模板", position = 3)
    private String comment;

}
