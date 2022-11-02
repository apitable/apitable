package com.vikadata.api.model.vo.labs;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

/**
 * <p>
 * GM命令返回创建后的实验性功能 值对象
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/26 21:05:06
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("GM命令返回创建后的实验性功能")
public class GmLabFeatureVo {

    @ApiModelProperty(value = "实验室功能唯一标识", dataType = "java.lang.String", example = "render_prompt|async_compute|robot|widget_center", position = 1)
    private String featureKey;

    @ApiModelProperty(value = "实验室功能作用域", dataType = "java.lang.String", example = "user|space", position = 2)
    private String featureScope;

    @ApiModelProperty(value = "实验室功能类别", dataType = "java.lang.String", example = "static|review|normal", position = 3)
    private String type;

    @ApiModelProperty(value = "申请内测功能的神奇表单地址", dataType = "java.lang.String", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String url;

    @ApiModelProperty(value = "实验室功能开启状态", dataType = "java.lang.Boolean", example = "true|false", position = 5)
    private Boolean open;

    @CreatedDate
    @ApiModelProperty(value = "创建时间", dataType = "java.time.LocalDateTime", example = "2021-10-26T12:34:56", position = 6)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @ApiModelProperty(value = "更新时间", dataType = "java.time.LocalDateTime", example = "2021-10-26T12:34:56", position = 7)
    private LocalDateTime updatedAt;
}
