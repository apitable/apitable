package com.apitable.interfaces.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ai setting.
 *
 * @author Shawn Deng
 */
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class AiQABotSetting {

    private String mode;
    private String model;
    private Boolean isEnabledPromptTips;
    private Boolean isEnabledPromptBox;
}
