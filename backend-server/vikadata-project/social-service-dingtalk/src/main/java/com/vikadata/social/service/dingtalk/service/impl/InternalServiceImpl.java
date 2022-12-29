package com.vikadata.social.service.dingtalk.service.impl;

import java.net.SocketTimeoutException;
import java.util.HashMap;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.apitable.starter.social.dingtalk.autoconfigure.DingTalkProperties;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.social.dingtalk.DingTalkServiceProvider;
import com.vikadata.social.dingtalk.util.DingTalkCallbackCrypto;
import com.vikadata.social.service.dingtalk.config.ConstProperties;
import com.vikadata.social.service.dingtalk.model.dto.DingTalkCallbackDto;
import com.vikadata.social.service.dingtalk.service.IInternalService;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/**
 * Internal service call interface implementation
 */
@Service
@Slf4j
public class InternalServiceImpl implements IInternalService {

    public static final String DING_TALK_CALLBACK_PATH = "/{}/{}/{}";

    @Resource
    private RestTemplate restTemplate;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private DingTalkProperties dingTalkProperties;

    @Override
    public void pushDingTalkSyncAction(String suiteId, String signature, String timestamp, String nonce,
            String encrypt) {
        // Retry mechanism to ensure synchronization and stability of asynchronous calls
        for (int i = 0; i < 3; i++) {
            try {
                HttpHeaders headers = new HttpHeaders();
                HashMap<String, String> map = new HashMap<>(1);
                map.put("encrypt", encrypt);
                String path = StrUtil.format(DING_TALK_CALLBACK_PATH,
                        dingTalkProperties.getBasePath(), dingTalkProperties.getSyncEventPath(), suiteId);
                String uri = UriComponentsBuilder.fromHttpUrl(constProperties.getVikaApiUrl() + path)
                        .queryParam("signature", signature)
                        .queryParam("nonce", nonce)
                        .queryParam("timestamp", timestamp)
                        .build().toString();
                HttpEntity<String> request = new HttpEntity<>(JSONUtil.toJsonStr(map), headers);
                ResponseEntity<DingTalkCallbackDto> response = restTemplate.postForEntity(uri, request, DingTalkCallbackDto.class);
                handleResponse(suiteId, response);
                break;
            }
            catch (Exception e) {
                log.error("call api exception", i, e);
                // timeout does not need to retry
                if (e.getCause() instanceof SocketTimeoutException) {
                    throw e;
                }
            }
        }
    }

    private <T extends DingTalkCallbackDto> void handleResponse(String suiteId, ResponseEntity<T> responseEntity) {
        if (responseEntity == null) {
            throw new BusinessException("response message can not be null");
        }
        if (!responseEntity.getStatusCode().is2xxSuccessful()) {
            if (responseEntity.getBody() != null) {
                throw new BusinessException("response http status not in 200");
            }
            else {
                throw new BusinessException("Failed to request java server, please check network or parameters");
            }
        }
        if (responseEntity.getBody() != null) {
            DingTalkCallbackDto body = responseEntity.getBody();
            if (body.getEncrypt() == null) {
                throw new BusinessException("java failed to process the message, the service did not return");
            }
            DingTalkServiceProvider dingtalkServiceProvider = SpringContextHolder.getBean(DingTalkServiceProvider.class);
            DingTalkCallbackCrypto callbackCrypto;
            String decryptMsg;
            try {
                callbackCrypto = dingtalkServiceProvider.getIsvDingTalkCallbackCrypto(suiteId);
                decryptMsg = callbackCrypto.getDecryptMsg(body.getMsgSignature(), body.getTimeStamp(), body.getNonce(),
                        body.getEncrypt());
            }
            catch (Exception e) {
                log.error("Parse java returns data exception: {}:[{}]", suiteId, body, e);
                throw new BusinessException("Parse java returns data exception");
            }
            if (!DING_TALK_CALLBACK_SUCCESS.equals(decryptMsg)) {
                log.error("java failed to process the message, return data: [{}]", decryptMsg);
                throw new BusinessException("java processing message failed");
            }
        }
    }
}
