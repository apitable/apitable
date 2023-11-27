package com.apitable.internal.vo;

import com.apitable.shared.support.serializer.CreditUnitSerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * internal space automation run message view.
 */
@Data
@Schema(description = "space automation run information view")
public class InternalSpaceAutomationRunMessageV0 {

    @Schema(description = "whether to allow over limiting", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean allowRun;

    @Schema(description = "Number of automation run", example = "1000")
    @JsonSerialize(nullsUsing = CreditUnitSerializer.class)
    private Long automationRunNums;

    @Schema(description = "the maximum automation run number for ai query(unit: int)", example = "1000")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxAutomationRunNums;
}
