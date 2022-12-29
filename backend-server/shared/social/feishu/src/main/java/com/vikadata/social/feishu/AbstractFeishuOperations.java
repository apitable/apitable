package com.vikadata.social.feishu;

import java.util.List;
import java.util.Map;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.StrUtil;

import com.vikadata.social.feishu.api.impl.FeishuTemplate;

import org.springframework.http.HttpHeaders;

import static com.vikadata.social.feishu.FeishuBase.API_URL_BASE;

/**
 * @author Shawn Deng
 * @date 2020-11-18 15:39:17
 */
public abstract class AbstractFeishuOperations {

    private final FeishuTemplate feishuTemplate;

    public AbstractFeishuOperations(FeishuTemplate feishuTemplate) {
        this.feishuTemplate = feishuTemplate;
    }

    public FeishuTemplate getFeishuTemplate() {
        return feishuTemplate;
    }

    protected String buildUri(String resourceUrl) {
        return StrUtil.concat(false, API_URL_BASE, resourceUrl);
    }

    protected Map<String, String> createAuthHeaders(String keyValue) {
        return MapUtil.of(HttpHeaders.AUTHORIZATION, "Bearer " + keyValue);
    }

    protected String buildUrlWithVariables(String url, Object o) {
        Map<String, ?> m = BeanUtil.beanToMap(o, true, true);
        StringBuilder sb = new StringBuilder(128);
        sb.append(url);
        if (!m.isEmpty()) {
            sb.append("?");
        }

        m.forEach((key, value) -> {
            if (value instanceof List) {
                ((List) value).forEach(v -> sb.append(key).append("=").append(v.toString()).append("&"));
            }
            else {
                sb.append(key).append("=").append(value.toString()).append("&");
            }
        });

        if (sb.charAt(sb.length() - 1) == '&') {
            sb.deleteCharAt(sb.length() - 1);
        }
        return sb.toString();
    }

}
