package com.vikadata.system.config.billing;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * <p>
 * 产品
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/8/31 15:13
 */
@Data
public class Product {

    private String id;

    private String category;

    private List<String> plans;

    private List<String> relatedFeatures;

    private String channel;

    private boolean free;

    @JsonProperty("i18nName")
    private String i18nName;

    private String chName;

    private List<String> prices;
}
