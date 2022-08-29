package com.vikadata.boot.autoconfigure.social;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.dingtalk.DingTalkServiceProvider;
import com.vikadata.social.dingtalk.Jackson4DingTalkConverter;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.lang.NonNull;

/**
 * 飞书事件回调接口
 * 统一回调接口
 *
 * @author Shawn Deng
 * @date 2020-11-20 16:11:03
 */
@SuppressWarnings("AlibabaUndefineMagicConstant")
public class DingTalkServlet extends HttpServlet implements ApplicationContextAware {

    private static final Logger LOGGER = LoggerFactory.getLogger(DingTalkServlet.class);

    private static final long serialVersionUID = 6321762161018702174L;

    private ApplicationContext applicationContext;

    /**
     * 钉钉回调路由，只有在返回加密的success字符串，回调才处理成功
     * @param  request 钉钉回调请求
     * @param response 返回
     * @author zoe zheng
     * @date 2021/5/13 3:36 下午
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        // 解析获取当前请求路径
        DingTalkProperties properties = applicationContext.getBean(DingTalkProperties.class);
        String path = parsePath(request);
        String[] paths = path.split("/");
        if (paths.length != 3 && !paths[0].equals(properties.getBasePath())) {
            LOGGER.error("请求地址跟钉钉请求地址不匹配:{}", properties.getBasePath());
            return;
        }
        String subscribeId = paths[paths.length - 1];
        String eventPath = paths[1];
        LOGGER.info("钉钉应用事件通知类型路径:{}/{}", eventPath, subscribeId);
        // 根据应用名称获取对应实例入口
        DingTalkServiceProvider provider = applicationContext.getBean(DingTalkServiceProvider.class);
        String msgSignature = request.getParameter("msg_signature");
        if (msgSignature == null) {
            msgSignature = request.getParameter("signature");
        }
        String timestamp = request.getParameter("timestamp");
        String nonce = request.getParameter("nonce");
        if (StrUtil.isBlank(msgSignature) || StrUtil.isBlank(timestamp) || StrUtil.isBlank(nonce)) {
            LOGGER.error("请求参数缺失:[{}]", request.getParameterMap());
            return;
        }
        String requestData = ServletUtil.getRequestBody(request);
        Map<String, String> json;
        try {
            json = Jackson4DingTalkConverter.toObject(requestData, new TypeReference<Map<String, String>>() {});
        }
        catch (IOException e) {
            LOGGER.error("钉钉集成配置错误:{}", path);
            // 不需要处理这种问题
            throw new RuntimeException(e);
        }
        String encryptMsg = json.get("encrypt");
        String responseData = "";
        if (eventPath.equals(properties.getEventPath())) {
            // 事件订阅推送
            responseData = provider.eventNotify(subscribeId, msgSignature, timestamp, nonce, encryptMsg);
        }
        else if (eventPath.equals(properties.getSyncEventPath())) {
            // 事件订阅推送
            responseData = provider.syncHttpEventNotifyForIsv(subscribeId, msgSignature, timestamp, nonce, encryptMsg);
        }
        else {
            LOGGER.error("非法的事件类型路径:{}", path);
        }

        // 响应数据
        ServletUtil.toResponseData(response, responseData);
    }

    private String parsePath(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        String ContentPath = request.getContextPath();
        return StringUtil.trimSlash(requestUri.substring(ContentPath.length()));
    }

    @Override
    public void setApplicationContext(@NonNull ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}
