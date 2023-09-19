package com.apitable.automation.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * Trigger RO.
 */
@Data
@Schema(description = "Trigger RO")
public class TriggerRO {

    @Schema(description = "trigger type id", requiredMode = Schema.RequiredMode.REQUIRED, example = "test")
    private String triggerTypeId;

    @Schema(description = "trigger input", requiredMode = Schema.RequiredMode.NOT_REQUIRED, example = "{}")
    private Object input;

    @Schema(description = "related resource id", requiredMode = Schema.RequiredMode.NOT_REQUIRED, example = "dst***/fom***")
    private String relatedResourceId;

    @Schema(description = "prev trigger id", requiredMode = Schema.RequiredMode.NOT_REQUIRED, example = "atr")
    private String prevTriggerId;
}
