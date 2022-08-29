package com.vikadata.social.feishu;

import com.vikadata.social.feishu.card.Card;

/**
 * 消息交互处理规范
 *
 * @author Shawn Deng
 * @date 2020-11-24 17:08:13
 */
public interface FeishuCardActionHandler {

    /**
     * 消息交互消息接收接口
     *
     * @param cardEvent 消息卡片交互事件
     * @return Card 卡片消息结构
     */
    Card doHandle(CardEvent cardEvent);
}
