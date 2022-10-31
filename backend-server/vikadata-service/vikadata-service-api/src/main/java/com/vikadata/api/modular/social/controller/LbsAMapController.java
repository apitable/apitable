package com.vikadata.api.modular.social.controller;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.util.URLUtil;
import io.swagger.annotations.Api;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.config.properties.AMapProperties;

import org.springframework.http.HttpMethod;
import org.springframework.http.client.ClientHttpRequest;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.RestController;

/** 
* <p> 
* AutoNavi Interface
* </p>
*/
@RestController
@ApiResource(path = "/")
@Api(tags = "AutoNavi Interface")
@Slf4j
public class LbsAMapController {
    @Resource
    private AMapProperties aMapProperties;

    @GetResource(path = "/_AMapService/**", requiredLogin = false)
    public void proxy(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String query = request.getQueryString().concat("&jscode=").concat(aMapProperties.getJscode());
        String uri = request.getRequestURI();
        URI newUri = URLUtil.toURI(aMapProperties.getRestapi().getProxyPass() + "?" + query);
        if (uri.contains("styles")) {
            newUri = URLUtil.toURI(aMapProperties.getStyles().getProxyPass() + "?" + query);
        }
        if (uri.contains("vectormap")) {
            newUri = URLUtil.toURI(aMapProperties.getVectormap().getProxyPass() + "?" + query);
        }
        // Execute Proxy Query
        String methodName = request.getMethod();
        HttpMethod httpMethod = HttpMethod.resolve(methodName);
        if(httpMethod == null) {
            return;
        }

        ClientHttpRequest delegate =  new SimpleClientHttpRequestFactory().createRequest(newUri, httpMethod);
        Enumeration<String> headerNames = request.getHeaderNames();
        // Set request header
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            Enumeration<String> v = request.getHeaders(headerName);
            List<String> arr = new ArrayList<>();
            while (v.hasMoreElements()) {
                arr.add(v.nextElement());
            }
            delegate.getHeaders().addAll(headerName, arr);
        }

        StreamUtils.copy(request.getInputStream(), delegate.getBody());
        // Execute remote call
        ClientHttpResponse clientHttpResponse = delegate.execute();
        response.setStatus(clientHttpResponse.getStatusCode().value());
        // Set Response Header
        clientHttpResponse.getHeaders().forEach((key, value) -> value.forEach(it -> {
            response.setHeader(key, it);
        }));
        StreamUtils.copy(clientHttpResponse.getBody(), response.getOutputStream());
    }


}
