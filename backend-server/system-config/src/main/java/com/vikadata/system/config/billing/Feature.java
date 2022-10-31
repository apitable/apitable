package com.vikadata.system.config.billing;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * <p>
 * Billing Feature
 * </p>
 */
@Data
public class Feature {

    private String id;

    private List<String> plans;

    private String function;

    @JsonProperty("functionType")
    private String functionType;

    private Long specification;

    private String unit;
}
