package com.vikadata.social.service.dingtalk.interceptor;

import net.devh.boot.grpc.server.interceptor.GrpcGlobalServerInterceptor;

import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class GlobalInterceptorConfiguration {
    @GrpcGlobalServerInterceptor
    ExceptionInterceptor exceptionInterceptor() {
        return new ExceptionInterceptor();
    }

}
