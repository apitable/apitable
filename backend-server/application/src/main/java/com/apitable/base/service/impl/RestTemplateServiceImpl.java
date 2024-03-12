/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.base.service.impl;

import static com.apitable.core.constants.ResponseExceptionConstants.DEFAULT_SUCCESS_CODE;

import cn.hutool.json.JSONUtil;
import com.apitable.base.service.RestTemplateService;
import com.apitable.core.exception.BusinessException;
import com.apitable.shared.config.properties.SocketProperties;
import com.apitable.workspace.ro.FieldPermissionChangeNotifyRo;
import com.apitable.workspace.ro.NodeShareDisableNotifyRo;
import jakarta.annotation.Resource;
import java.util.Collections;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

/**
 * RestTemplate service implementation class.
 */
@Slf4j
@Service
public class RestTemplateServiceImpl implements RestTemplateService {

    @Resource
    private RestClient restClient;

    @Resource
    private SocketProperties socketProperties;

    @Override
    public void disableNodeShareNotify(List<NodeShareDisableNotifyRo> message) {
        log.info("Close node sharing notification");
        HttpHeaders headers = new HttpHeaders();
        headers.put("token", Collections.singletonList(socketProperties.getToken()));
        String url = socketProperties.getDomain() + socketProperties.getDisableNodeShareNotify();
        String result = restClient.post()
            .uri(url)
            .headers(header -> header.addAll(headers))
            .body(message)
            .retrieve()
            .body(String.class);
        Integer code = JSONUtil.parseObj(result).getInt("code");
        if (!code.equals(DEFAULT_SUCCESS_CODE)) {
            throw new BusinessException("Failed to close the node share notification call！Msg: "
                + JSONUtil.parseObj(result).getStr("message"));
        }
    }

    @Override
    public void fieldPermissionChangeNotify(FieldPermissionChangeNotifyRo message) {
        log.info("Field permission change notification");
        HttpHeaders headers = new HttpHeaders();
        headers.put("token", Collections.singletonList(socketProperties.getToken()));
        String url =
            socketProperties.getDomain() + socketProperties.getFieldPermissionChangeNotify();
        String result = restClient.post()
            .uri(url)
            .headers(header -> header.addAll(headers))
            .body(message)
            .retrieve()
            .body(String.class);
        Integer code = JSONUtil.parseObj(result).getInt("code");
        if (!code.equals(DEFAULT_SUCCESS_CODE)) {
            throw new BusinessException("Field permission change notification call failed！Msg: "
                + JSONUtil.parseObj(result).getStr("message"));
        }
    }
}
