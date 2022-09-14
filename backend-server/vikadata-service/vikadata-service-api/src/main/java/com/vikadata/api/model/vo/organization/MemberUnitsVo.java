package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.core.support.serializer.NumberListToStringListSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * <p>
 * 成员归属的组织单元
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/4/13 14:41
 */
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("成员归属的组织单元")
public class MemberUnitsVo {

    @ApiModelProperty(value = "组织单元ID列表", dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 1)
    @JsonSerialize(using = NumberListToStringListSerializer.class)
    private List<Long> unitIds;
}
