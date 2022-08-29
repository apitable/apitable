package com.vikadata.social.feishu.card;

/**
 * 消息卡片组件接口
 *
 * @author Shawn Deng
 * @date 2020-11-24 11:51:03
 */
public interface CardComponent {

    /**
     * JSON转换成对象
     *
     * @return 对象
     */
    Object toObj();
}
