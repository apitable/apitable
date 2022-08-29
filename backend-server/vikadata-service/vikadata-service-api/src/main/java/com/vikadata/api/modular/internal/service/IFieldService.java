package com.vikadata.api.modular.internal.service;

import java.util.List;
import java.util.Map;

import com.vikadata.api.modular.internal.model.UrlAwareContentVo;
import com.vikadata.api.modular.internal.model.UrlAwareContentsVo;

/**
 * <p>
 *     字段相关功能
 * </p>
 *
 * @author tao
 */
public interface IFieldService {

    /**
     * 获取url的网址信息
     * @param urls url
     * @param userId 用户id
     * @return url网址信息
     */
    UrlAwareContentsVo getUrlAwareContents(List<String> urls, Long userId);
}
