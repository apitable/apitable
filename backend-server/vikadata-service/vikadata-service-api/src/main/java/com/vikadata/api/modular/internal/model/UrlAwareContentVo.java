package com.vikadata.api.modular.internal.model;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * <p>
 *
 * </p>
 *
 * @author tao
 */
@Data
@ApiModel("网址内容识别结果")
public class UrlAwareContentVo{

    private Boolean isAware;

    private String favicon;

    private String title;

    public UrlAwareContentVo() {
    }

    public UrlAwareContentVo(Boolean isAware) {
        this.isAware = isAware;
    }
}
