package com.vikadata.integration.idaas;

/**
 * <p>
 * request IDaaS interface exception
 * </p>
 *
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
