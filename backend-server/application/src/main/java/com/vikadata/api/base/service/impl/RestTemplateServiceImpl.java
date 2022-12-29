package com.vikadata.api.base.service.impl;

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.base.service.RestTemplateService;
import com.vikadata.api.shared.config.properties.SocketProperties;
import com.vikadata.api.workspace.ro.FieldPermissionChangeNotifyRo;
import com.vikadata.api.workspace.ro.NodeShareDisableNotifyRo;
import com.vikadata.core.exception.BusinessException;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import static com.vikadata.core.constants.ResponseExceptionConstants.DEFAULT_SUCCESS_CODE;

/**
 * RestTemplate service implementation class
 *
 */
@Slf4j
@Service
public class RestTemplateServiceImpl implements RestTemplateService {

    @Resource
    private RestTemplate restTemplate;

    @Resource
    private SocketProperties socketProperties;

    @Override
    public void disableNodeShareNotify(List<NodeShareDisableNotifyRo> message) {
        log.info("Close node sharing notification");
        HttpHeaders headers = new HttpHeaders();
        headers.put("token", Collections.singletonList(socketProperties.getToken()));
        String url = socketProperties.getDomain() + socketProperties.getDisableNodeShareNotify();
        HttpEntity<Object> request = new HttpEntity<>(message, headers);
        String result = restTemplate.postForObject(url, request, String.class);
        Integer code = JSONUtil.parseObj(result).getInt("code");
        if (!code.equals(DEFAULT_SUCCESS_CODE)) {
            throw new BusinessException("Failed to close the node share notification call！Msg: " + JSONUtil.parseObj(result).getStr("message"));
        }
    }

    @Override
    public void fieldPermissionChangeNotify(FieldPermissionChangeNotifyRo message) {
        log.info("Field permission change notification");
        HttpHeaders headers = new HttpHeaders();
        headers.put("token", Collections.singletonList(socketProperties.getToken()));
        String url = socketProperties.getDomain() + socketProperties.getFieldPermissionChangeNotify();
        HttpEntity<Object> request = new HttpEntity<>(message, headers);
        String result = restTemplate.postForObject(url, request, String.class);
        Integer code = JSONUtil.parseObj(result).getInt("code");
        if (!code.equals(DEFAULT_SUCCESS_CODE)) {
            throw new BusinessException("Field permission change notification call failed！Msg: " + JSONUtil.parseObj(result).getStr("message"));
        }
    }
}
