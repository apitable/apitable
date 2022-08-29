package com.vikadata.social.dingtalk.message;

/**
 * <p>
 * 消息组件接口
 * </p>
 * @author zoe zheng
 * @date 2021/4/21 2:28 下午
 */
public interface Component {

    /**
     * JSON转换成对象
     *
     * @return 对象
     */
    Object toObj();
}
