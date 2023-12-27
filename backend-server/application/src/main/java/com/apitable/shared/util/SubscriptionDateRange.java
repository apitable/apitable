package com.apitable.shared.util;

import static com.apitable.shared.util.DateHelper.safeSetDayOfMonth;

import com.apitable.interfaces.billing.model.CycleDateRange;
import com.apitable.interfaces.billing.model.SubscriptionInfo;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;

/**
 * subscription util.
 */
public class SubscriptionDateRange {

    /**
     * Date range rule:
     * If it's a free version, the start date is set to the first day of the current month, and the end date is set to the current day.
     * If today's date is before the billing date, the start date is set to the same day of the previous month as the billing date, and the end date is today.
     * If today's date is after the billing date, the start date is the billing date of the current month, and the end date is today.
     * If today's date is the same as the billing date, the start date is the same day of the previous month as the billing date, and the end date is today.
     *
     * @param subscriptionInfo subscription info
     * @param now              now date
     * @return cycle date range
     */
    public static CycleDateRange calculateCycleDate(SubscriptionInfo subscriptionInfo,
                                                    LocalDate now) {
        LocalDate cycleStartDate;
        LocalDate cycleEndDate;
        if (subscriptionInfo.isFree()) {
            // free
            cycleStartDate = now.with(TemporalAdjusters.firstDayOfMonth());
            cycleEndDate = now;
        } else if (subscriptionInfo.onTrial()) {
            // trial
            cycleStartDate = subscriptionInfo.getStartDate();
            cycleEndDate = subscriptionInfo.getEndDate();
        } else {
            // paid
            int dayOfCurrentMonth = now.getDayOfMonth();
            int cycleDayOfMonth = subscriptionInfo.cycleDayOfMonth(dayOfCurrentMonth);
            if (dayOfCurrentMonth <= cycleDayOfMonth) {
                // before cycle day
                cycleStartDate = safeSetDayOfMonth(now, cycleDayOfMonth).minusMonths(1);
            } else {
                // after cycle day
                cycleStartDate = safeSetDayOfMonth(now, cycleDayOfMonth);
            }
            cycleEndDate = now;
        }

        return new CycleDateRange(cycleStartDate, cycleEndDate);
    }
}
