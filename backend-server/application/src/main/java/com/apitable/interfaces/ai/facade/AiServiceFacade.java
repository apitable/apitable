package com.apitable.interfaces.ai.facade;

import com.apitable.interfaces.ai.model.AiCreateParam;
import com.apitable.interfaces.ai.model.AiUpdateParam;
import com.apitable.interfaces.ai.model.ChartTimeDimension;
import com.apitable.interfaces.ai.model.CreditTransactionChartData;
import java.util.List;

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
    void createAi(AiCreateParam param);

    /**
     * update ai.
     *
     * @param aiId  ai unique id
     * @param param update parameter
     */
    void updateAi(String aiId, AiUpdateParam param);

    /**
     * delete ai node.
     *
     * @param aiId ai unique id
     */
    void deleteAi(List<String> aiId);

    /**
     * load credit transaction chart data.
     *
     * @param spaceId            space id
     * @param chartTimeDimension chart time dimension
     * @return CreditConsumeChartData
     */
    List<CreditTransactionChartData> loadCreditTransactionChartData(
        String spaceId, ChartTimeDimension chartTimeDimension);
}
