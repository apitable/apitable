package com.vikadata.core.exception;

import java.util.Map;

/**
 * <p>
 * Business Exception
 * </p>
 */
public class BusinessException extends RuntimeException {

    private static final long serialVersionUID = 6018501357401552444L;

    /**
     * Business Exception Status Code
     */
    private Integer code;

    /**
     * Fixed enumeration encoding for i18n internationalization recognition
     */
    private String fixedCode;

    private Map<String, Object> body;

    public Map<String, Object> getBody() {
        return body;
    }

    public BusinessException(BaseException exception, Map<String, Object> body) {
        super(exception.getMessage());
        this.code = exception.getCode();
        this.body = body;
        this.fixedCode = exception.toString();
    }

    public BusinessException(Throwable cause) {
        super(cause);
    }

    public BusinessException(String message) {
        super(message);
    }

    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(int code, String msgFormat, Object... args) {
        super(String.format(msgFormat, args));
        this.code = code;
    }

    public BusinessException(BaseException exception) {
        super(exception.getMessage());
        this.code = exception.getCode();
        this.fixedCode = exception.toString();
    }

    public BusinessException(int code, String message, Object data) {
        super(message);
        this.code = code;
    }

    public Integer getCode() {
        return code;
    }

    public String getFixedCode() {
        return fixedCode;
    }
}
