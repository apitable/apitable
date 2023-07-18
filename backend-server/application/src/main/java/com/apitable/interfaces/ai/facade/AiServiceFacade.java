package com.apitable.interfaces.ai.facade;

import com.apitable.interfaces.ai.model.AiChatBotFromDatasheetCreateParam;

/**
 * AI service facade.
 *
 * @author Shawn Deng
 */
public interface AiServiceFacade {

    /**
     * create AI by Datasheet datasource.
     *
     * @param param create param
     */
    void createAiChatBot(AiChatBotFromDatasheetCreateParam param);
}
