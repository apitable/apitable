package com.vikadata.api.model.vo.organization;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.NullArraySerializer;
import com.vikadata.core.support.serializer.NumberListToStringListSerializer;

/**
 * <p>
 * Organizational unit to which the member belongs
 * </p>
 */
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@ApiModel("Organizational unit to which the member belongs")
public class MemberUnitsVo {

    @ApiModelProperty(value = "Org Unit ID List", dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 1)
    @JsonSerialize(using = NumberListToStringListSerializer.class, nullsUsing = NullArraySerializer.class)
    private List<Long> unitIds;
}
