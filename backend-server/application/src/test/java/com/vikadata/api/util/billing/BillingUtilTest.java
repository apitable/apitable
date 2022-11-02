package com.vikadata.api.util.billing;

import org.junit.jupiter.api.Test;

import static com.vikadata.api.util.billing.BillingUtil.legacyPlanId;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author Shawn Deng
 */
public class BillingUtilTest {

    @Test
    public void testSilverOnLegacyPlanIdWithoutChange() {
        String legacyPlan = "silver_10";
        assertThat(legacyPlanId(legacyPlan)).isEqualTo(legacyPlan);
    }

    @Test
    public void testSilverOnLegacyPlanId() {
        String legacyPlan = "silver_10_monthly";
        assertThat(legacyPlanId(legacyPlan)).isEqualTo("silver_10");
    }

    @Test
    public void testGoldOnLegacyPlanIdWithoutChange() {
        String legacyPlan = "gold_100";
        assertThat(legacyPlanId(legacyPlan)).isEqualTo(legacyPlan);
    }

    @Test
    public void testEnterpriseOnLegacyPlanId() {
        String legacyPlan = "enterprise_200_monthly";
        assertThat(legacyPlanId(legacyPlan)).isEqualTo("enterprise_200");
    }

    @Test
    public void testEnterpriseOnLegacyPlanIdWithoutChange() {
        String legacyPlan = "enterprise_200";
        assertThat(legacyPlanId(legacyPlan)).isEqualTo(legacyPlan);
    }

    @Test
    public void testGoldOnLegacyPlanId() {
        String legacyPlan = "gold_100_monthly_v1";
        assertThat(legacyPlanId(legacyPlan)).isEqualTo("gold_100");
    }

    @Test
    public void testDingtalkFreeOnLegacyPlanId() {
        String legacyPlan = "dingtalk_base_no_billing_period";
        assertThat(legacyPlanId(legacyPlan)).isEqualTo(legacyPlan);
    }
}
