package com.apitable.automation.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Update Action RO.
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Schema(description = "Update Action RO")
public class UpdateActionRO extends ActionRO {

    @Schema(description = "action type id", requiredMode = Schema.RequiredMode.NOT_REQUIRED, example = "test")
    private String actionTypeId;
}
