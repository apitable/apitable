package com.vikadata.api.modular.internal.model;

import java.util.List;
import java.util.Map;

import lombok.Data;

/**
 * @author tao
 */
@Data
public class UrlAwareContentsVo {

    private Map<String, UrlAwareContentVo> contents;

}
