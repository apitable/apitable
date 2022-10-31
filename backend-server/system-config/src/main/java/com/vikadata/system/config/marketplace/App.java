package com.vikadata.system.config.marketplace;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * <p>
 * App
 * </p>
 */
@Data
public class App {

    private String appType;

    @JsonProperty("disable")
    private boolean disable;

    private Image logo;

    private String appInfo;

    private String htmlStr;

    private String note;

    private String appName;

    private String type;

    private String appDescription;

    private String id;

    private Image image;

    private String appId;

    private BtnCard btnCard;

    private List<String> env;

    private Integer displayOrder;
}
