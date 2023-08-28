package com.apitable.space.model;

import com.apitable.interfaces.ai.model.CreditTransactionChartData;
import java.util.ArrayList;
import java.util.List;

/**
 * credit usages.
 *
 * @author Shawn Deng
 */
public class CreditUsages extends ArrayList<CreditUsage> {

    /**
     * create credit usages from credit transaction chart data collection.
     *
     * @param dataCollection credit transaction chart data collection
     * @return CreditUsages
     */
    public static CreditUsages of(List<CreditTransactionChartData> dataCollection) {
        CreditUsages usages = new CreditUsages();
        dataCollection.forEach(data -> {
            CreditUsage creditUsage = new CreditUsage();
            creditUsage.setDateline(data.getDateline());
            creditUsage.setCount(data.getTotalCount());
            usages.add(creditUsage);
        });
        return usages;
    }
}
