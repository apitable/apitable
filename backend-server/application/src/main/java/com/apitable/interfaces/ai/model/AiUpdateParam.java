package com.apitable.interfaces.ai.model;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * create AI chatBot from datasheet params.
 *
 * @author Shawn Deng
 */
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class AiUpdateParam {

    private String name;

    private Map<String, Object> setting;
}
