package com.apitable.interfaces.ai.facade;

import com.apitable.interfaces.ai.model.AiCreateParam;
import com.apitable.interfaces.ai.model.AiUpdateParam;
import com.apitable.interfaces.ai.model.ChartTimeDimension;
import com.apitable.interfaces.ai.model.CreditTransactionChartData;
import java.math.BigDecimal;
import java.time.LocalDate;
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
     * @param aiId        ai unique id
     * @param updateParam update parameter
     */
    void updateAi(String aiId, AiUpdateParam updateParam);

    /**
     * delete ai node.
     *
     * @param aiId ai unique id
     */
    void deleteAi(List<String> aiId);

    /**
     * get total credit transaction count.
     *
     * @param spaceId   space id
     * @param beginDate begin date
     * @param endDate   end date
     * @return total credit transaction count
     */
    BigDecimal getUsedCreditCount(String spaceId, LocalDate beginDate, LocalDate endDate);

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
