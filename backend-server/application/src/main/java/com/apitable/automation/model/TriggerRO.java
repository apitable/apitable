package com.apitable.automation.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
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

    @Schema(description = "schedule config", requiredMode = Schema.RequiredMode.NOT_REQUIRED, example = "{}")
    @Valid
    private TriggerScheduleConfig scheduleConfig;

    /**
     * schedule config.
     */
    @Data
    @Schema(description = "Trigger schedule config ro")
    public static class TriggerScheduleConfig {
        @Schema(description = "second", requiredMode = Schema.RequiredMode.REQUIRED, example = "*")
        private String second;

        @Schema(description = "minute", requiredMode = Schema.RequiredMode.REQUIRED, example = "*")
        @NotBlank(message = "minute cannot be empty")
        private String minute;

        @Schema(description = "hour", requiredMode = Schema.RequiredMode.REQUIRED, example = "*")
        @NotBlank(message = "hour cannot be empty")
        private String hour;

        @Schema(description = "month", requiredMode = Schema.RequiredMode.REQUIRED, example = "*")
        @NotBlank(message = "month cannot be empty")
        private String month;

        @Schema(description = "dayOfMonth", requiredMode = Schema.RequiredMode.REQUIRED, example = "*")
        @NotBlank(message = "dayOfMonth cannot be empty")
        private String dayOfMonth;

        @Schema(description = "dayOfWeek", requiredMode = Schema.RequiredMode.REQUIRED, example = "*")
        @NotBlank(message = "dayOfWeek cannot be empty")
        private String dayOfWeek;

        @Schema(description = "timeZone", requiredMode = Schema.RequiredMode.REQUIRED, example = "UTC")
        @NotBlank(message = "timeZone cannot be empty")
        private String timeZone;
    }
}
