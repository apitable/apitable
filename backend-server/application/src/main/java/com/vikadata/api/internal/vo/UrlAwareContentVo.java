package com.vikadata.api.internal.vo;

import io.swagger.annotations.ApiModel;
import lombok.Data;

@Data
@ApiModel("URL Content Recognition Results")
public class UrlAwareContentVo {

    private Boolean isAware;

    private String favicon;

    private String title;

    public UrlAwareContentVo() {
    }

    public UrlAwareContentVo(Boolean isAware) {
        this.isAware = isAware;
    }
}
