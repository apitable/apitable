package com.apitable.workspace.vo;

import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Node simple VO.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NodeSimpleVO extends NodePathVo {
    @Schema(description = "Node icon", example = ":smile")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String icon;
}
