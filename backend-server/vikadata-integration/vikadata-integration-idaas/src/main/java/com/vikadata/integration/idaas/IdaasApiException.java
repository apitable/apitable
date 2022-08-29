package com.vikadata.integration.idaas;

/**
 * <p>
 * 请求玉符 IDaaS 接口异常
 * </p>
 * @author 刘斌华
 * @date 2022-05-12 16:48:00
 */
public class IdaasApiException extends Exception {

    public IdaasApiException() {
        super();
    }

    public IdaasApiException(String message) {
        super(message);
    }

    public IdaasApiException(Throwable cause) {
        super(cause);
    }

    public IdaasApiException(String message, Throwable cause) {
        super(message, cause);
    }

}
