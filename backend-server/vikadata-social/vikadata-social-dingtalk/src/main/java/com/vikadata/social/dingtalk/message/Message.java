package com.vikadata.social.dingtalk.message;

/**
 * <p>
 * 消息类型接口
 * </p>
 * @author zoe zheng
 * @date 2021/4/21 11:09 上午
 */
public interface Message {

    String getMsgType();

    Object getMsgObj();

}
