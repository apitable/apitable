package com.vikadata.system.config.billing;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * <p>
 * 方案套餐 特性
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/8/31 15:13
 */
@Data
public class Feature {

    private String id;

    private List<String> plans;

    private String function;

    @JsonProperty("functionType")
    private String functionType;

    private Long specification;
}
