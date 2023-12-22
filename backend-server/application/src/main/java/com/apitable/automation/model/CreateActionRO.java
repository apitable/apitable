package com.apitable.automation.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Create Action RO.
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Schema(description = "Create Action RO")
public class CreateActionRO extends ActionRO {

    @Schema(description = "action type id", requiredMode = Schema.RequiredMode.REQUIRED, example = "test")
    @NotBlank(message = "Action type id cannot be empty")
    private String actionTypeId;
}
