package com.vikadata.social.dingtalk.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/** 
* <p> 
* 注册钉钉回调url
* </p> 
* @author zoe zheng 
* @date 2021/5/12 7:19 下午
*/
@Getter
@Setter
@ToString
public class DingTalkRegisterCallbackUrlRequest {

    /**
     * 接收事件回调的url，必须是公网可以访问的url地址。
     */
    private String url;

    /**
     * 数据加密密钥。用于回调数据的加密，长度固定为43个字符，从a-z，A-Z，0-9共62个字符中选取，您可以随机生成，ISV(服务提供商)推荐使用注册套件时填写的EncodingAESKey。
     */
    private String aesKey;

    /**
     * 加解密需要用到的token，可以随机填写，长度大于等于6个字符且少于64个字符。
     */
    private String token;

    /**
     * 注册的事件类型，详情请参考事件列表。
     */
    private List<String> callBackTag;
}
