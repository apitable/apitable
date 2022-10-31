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
 * feishu servlet
 *
 * @author Shawn Deng
 */
public class FeishuServlet extends HttpServlet implements ApplicationContextAware {

    private static final Logger LOGGER = LoggerFactory.getLogger(FeishuServlet.class);

    private ApplicationContext applicationContext;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        FeishuProperties properties = applicationContext.getBean(FeishuProperties.class);
        String path = parsePath(request);
        String[] paths = path.split("/");
        if (paths.length != 2 && !paths[0].equals(properties.getBasePath())) {
            LOGGER.error("The request address does not match the request address :{}", properties.getBasePath());
            return;
        }
        String eventType = paths[1];
        FeishuServiceProvider provider = applicationContext.getBean(FeishuServiceProvider.class);
        String requestData = ServletUtil.getRequestBody(request);
        LOGGER.info("event type：{}", eventType);
        String responseData = null;
        if (eventType.equals(properties.getEventPath())) {
            // event subscribe
            responseData = provider.wrapperEventNotify(requestData);
        }
        else if (eventType.equals(properties.getCardEventPath())) {
            // card event subscribe
            responseData = provider.cardNotify(requestData);
        }
        else {
            LOGGER.error("Illegal event type: {}", eventType);
        }
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
