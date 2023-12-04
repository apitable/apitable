package com.apitable.automation.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Trigger RO.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Trigger RO")
public abstract class TriggerRO {

    @Schema(description = "robot id", requiredMode = Schema.RequiredMode.REQUIRED, example = "arb****")
    @NotBlank(message = "Robot id cannot be empty")
    private String robotId;

    @Schema(description = "trigger input", requiredMode = Schema.RequiredMode.NOT_REQUIRED, example = "{}")
    private Object input;

    @Schema(description = "related resource id", requiredMode = Schema.RequiredMode.NOT_REQUIRED, example = "dst***/fom***")
    private String relatedResourceId;

    @Schema(description = "prev trigger id", requiredMode = Schema.RequiredMode.NOT_REQUIRED, example = "atr")
    private String prevTriggerId;
}
