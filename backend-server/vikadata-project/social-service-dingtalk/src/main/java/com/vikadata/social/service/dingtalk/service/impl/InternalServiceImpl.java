package com.vikadata.social.service.dingtalk.service.impl;

import java.net.SocketTimeoutException;
import java.util.HashMap;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.boot.autoconfigure.social.DingTalkProperties;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
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
 * <p> 
 * 内部服务调用接口实现 
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/8 6:57 下午
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
        // 重试机制，保证异步调用同步稳定
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
                log.error("调用API异常:{}", i, e);
                // 超时 不需要重试
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
                throw new BusinessException("请求java服务器失败，请检查网络或者参数");
            }
        }
        if (responseEntity.getBody() != null) {
            DingTalkCallbackDto body = responseEntity.getBody();
            if (body.getEncrypt() == null) {
                throw new BusinessException("java处理消息失败,服务无返回");
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
                log.error("解析java返回数据异常:{}:[{}]", suiteId, body, e);
                throw new BusinessException("解析java返回数据异常");
            }
            if (!DING_TALK_CALLBACK_SUCCESS.equals(decryptMsg)) {
                log.error("java处理消息失败,返回数据:[{}]", decryptMsg);
                throw new BusinessException("java处理消息失败");
            }
        }
    }
}
