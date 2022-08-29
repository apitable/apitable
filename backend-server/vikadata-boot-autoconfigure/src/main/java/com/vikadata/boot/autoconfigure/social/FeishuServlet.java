package com.vikadata.boot.autoconfigure.social;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.feishu.FeishuServiceProvider;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

/**
 * 飞书事件回调接口
 * 商店应用事件入口，非自建应用入口
 *
 * @author Shawn Deng
 * @date 2020-11-20 16:11:03
 */
public class FeishuServlet extends HttpServlet implements ApplicationContextAware {

    private static final Logger LOGGER = LoggerFactory.getLogger(FeishuServlet.class);

    private ApplicationContext applicationContext;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        // 解析获取当前请求路径
        FeishuProperties properties = applicationContext.getBean(FeishuProperties.class);
        String path = parsePath(request);
        String[] paths = path.split("/");
        if (paths.length != 2 && !paths[0].equals(properties.getBasePath())) {
            LOGGER.error("请求地址跟飞书请求地址不匹配:{}", properties.getBasePath());
            return;
        }
        String eventType = paths[1];
        // 根据应用名称获取对应实例入口
        FeishuServiceProvider provider = applicationContext.getBean(FeishuServiceProvider.class);
        String requestData = ServletUtil.getRequestBody(request);
        LOGGER.info("飞书事件通知类型：{}", eventType);
        String responseData = null;
        if (eventType.equals(properties.getEventPath())) {
            // 事件订阅推送
            responseData = provider.wrapperEventNotify(requestData);
        }
        else if (eventType.equals(properties.getCardEventPath())) {
            // 消息卡片推送
            responseData = provider.cardNotify(requestData);
        }
        else {
            LOGGER.error("非法的事件类型: {}", eventType);
        }
        // 响应数据
        ServletUtil.toResponseData(response, responseData);
    }

    private String parsePath(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        String basePath = request.getServletPath();
        return StringUtil.trimSlash(requestUri.substring(basePath.length()));
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}
