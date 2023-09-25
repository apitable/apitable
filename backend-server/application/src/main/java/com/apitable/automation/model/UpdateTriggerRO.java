package com.apitable.automation.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Update Trigger RO.
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Schema(description = "Update Trigger RO")
public class UpdateTriggerRO extends TriggerRO {

    @Schema(description = "trigger type id", requiredMode = Schema.RequiredMode.NOT_REQUIRED, example = "test")
    private String triggerTypeId;
}
