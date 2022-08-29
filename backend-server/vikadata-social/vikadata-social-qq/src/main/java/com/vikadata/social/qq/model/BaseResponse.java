package com.vikadata.social.qq.model;

/**
 * @author Shawn Deng
 * @date 2021-01-11 18:59:57
 */
public class BaseResponse {

    private Integer ret;

    private String msg;

    public Integer getRet() {
        return ret;
    }

    public void setRet(Integer ret) {
        this.ret = ret;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
