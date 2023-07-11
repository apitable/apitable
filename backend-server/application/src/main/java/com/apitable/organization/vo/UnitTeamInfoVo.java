package com.apitable.organization.vo;

import com.apitable.shared.support.serializer.NullArraySerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;
import lombok.Data;

/**
 * Unit Team.
 */
@Builder(toBuilder = true)
@Data
public class UnitTeamInfoVo {
    @Schema(description = "Team unit id", type = "java.lang.String", example = "aff")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String unitId;

    @Schema(description = "Team parent unit id", type = "java.lang.String", example = "aff")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String parentUnitId;

    @Schema(description = "Team name", type = "java.lang.String", example = "aff")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String name;

    @Schema(description = "Team sequence", type = "java.lang.Integer", example = "1")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer sequence;

    @Schema(description = "Org Unit's roles")
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<UnitRoleInfoVo> roles;
}
