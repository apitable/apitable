package com.vikadata.api.model.vo.datasheet;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;
import lombok.experimental.Accessors;

/**
 * <p>
 * 数表操作表
 * </p>
 *
 * @author Benson Cheung
 * @since 2019-09-23
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@EqualsAndHashCode
@Accessors(chain = true)
@ApiModel("数表操作表")
public class DatasheetOperationVo {

    @ApiModelProperty(value = "操作ID", position = 2)
    private String opId;

    @ApiModelProperty(value = "数表ID", position = 3)
    private String dstId;

    @ApiModelProperty(value = "操作名称", position = 4)
    private String actionName;

    @ApiModelProperty(value = "操作的合集", position = 5)
    private String actions;

    @ApiModelProperty(value = "类型 1-JOT 2-COT", position = 6)
    private Integer type;

    @ApiModelProperty(value = "操作成员ID", position = 7)
    private Long memberId;

    @ApiModelProperty(value = "版本号", position = 8)
    private Long revision;


}
