package com.apitable.interfaces.ai.facade;

import com.apitable.interfaces.ai.model.AiCreateParam;
import com.apitable.interfaces.ai.model.AiUpdateParam;
import com.apitable.interfaces.ai.model.ChartTimeDimension;
import com.apitable.interfaces.ai.model.CreditTransactionChartData;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

/**
 * Default ai service facade implements.
 *
 * @author Shawn Deng
 */
public class DefaultAiServiceFacadeImpl implements AiServiceFacade {

    @Override
    public void createAi(AiCreateParam param) {

    }

    @Override
    public void updateAi(String aiId, AiUpdateParam param) {

    }

    @Override
    public void deleteAi(List<String> aiId) {

    }

    @Override
    public BigDecimal getUsedCreditCount(String spaceId, LocalDate startDate, LocalDate endDate) {
        return BigDecimal.ZERO;
    }

    @Override
    public List<CreditTransactionChartData> loadCreditTransactionChartData(
        String spaceId, ChartTimeDimension chartTimeDimension) {
        return Collections.emptyList();
    }
}
