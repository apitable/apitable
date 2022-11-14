package com.vikadata.api.internal.model;

import java.util.Map;

import lombok.Data;

/**
 * @author tao
 */
@Data
public class UrlAwareContentsVo {

    private Map<String, UrlAwareContentVo> contents;

}
