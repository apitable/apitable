package com.vikadata.api.modular.internal.service;

import java.util.List;

import com.vikadata.api.modular.internal.model.UrlAwareContentsVo;

/**
 * Field related functions
 *
 */
public interface IFieldService {

    /**
     * get the url information of the url
     * @param urls url
     * @param userId User id
     * @return url information
     */
    UrlAwareContentsVo getUrlAwareContents(List<String> urls, Long userId);
}
