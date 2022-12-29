package com.vikadata.social.feishu;

import com.vikadata.social.feishu.card.Card;

/**
 * Message card action handler interface
 */
public interface FeishuCardActionHandler {

    /**
     * message receiving interface
     *
     * @param cardEvent message card events
     * @return Card message structure
     */
    Card doHandle(CardEvent cardEvent);
}
