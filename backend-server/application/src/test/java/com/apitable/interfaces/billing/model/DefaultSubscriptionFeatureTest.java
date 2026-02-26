package com.apitable.interfaces.billing.model;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class DefaultSubscriptionFeatureTest {

    @Test
    public void testDefaultSeatLimit() {
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        // Should be unlimited
        assertThat(feature.getSeat().isUnlimited()).isTrue();
        assertThat(feature.getSeat().getValue()).isEqualTo(-1L);
    }

    @Test
    public void testDefaultFileNodeNums() {
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        // Should be unlimited
        assertThat(feature.getFileNodeNums().isUnlimited()).isTrue();
        assertThat(feature.getFileNodeNums().getValue()).isEqualTo(-1L);
    }

    @Test
    public void testDefaultRowsPerSheet() {
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        // Should be 50,000
        assertThat(feature.getRowsPerSheet().getValue()).isEqualTo(50000L);
    }

    @Test
    public void testDefaultTotalRows() {
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        // Should be unlimited
        assertThat(feature.getTotalRows().isUnlimited()).isTrue();
        assertThat(feature.getTotalRows().getValue()).isEqualTo(-1L);
    }

    @Test
    public void testDefaultCapacitySize() {
        DefaultSubscriptionFeature feature = new DefaultSubscriptionFeature();
        // Should be unlimited
        assertThat(feature.getCapacitySize().isUnlimited()).isTrue();
        assertThat(feature.getCapacitySize().getValue().toBytes()).isEqualTo(-1L);
    }
}
