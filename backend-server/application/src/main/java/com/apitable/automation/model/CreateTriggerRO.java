package com.apitable.automation.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Create Trigger RO.
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Schema(description = "Create Trigger RO")
public class CreateTriggerRO extends TriggerRO {

    @Schema(description = "trigger type id", requiredMode = Schema.RequiredMode.REQUIRED, example = "test")
    @NotBlank(message = "Trigger type id cannot be empty")
    private String triggerTypeId;
}
