package com.vikadata.social.qq;

/**
 *
 * @author Shawn Deng
 * @date 2021-04-13 17:39:59
 */
public class QQException extends Exception {

    private final int code;

    public QQException(String message) {
        this(500, message);
    }

    public QQException(int code, String msg) {
        super("code :" + code + ", " + msg);
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
