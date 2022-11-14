package com.vikadata.api.enterprise.billing.core;

import com.vikadata.api.enterprise.billing.util.model.ProductEnum;

/**
 * Subscription Product
 */
public class ComparableProduct implements Comparable<ComparableProduct> {

    private ProductEnum product;

    public ComparableProduct(ProductEnum product) {
        this.product = product;
    }

    @Override
    public int compareTo(ComparableProduct other) {
        return product.getRank() - other.getProduct().getRank();
    }

    public boolean isEqual(ComparableProduct other) {
        return this.compareTo(other) == 0;
    }

    public boolean isGreaterThan(ComparableProduct other) {
        return this.compareTo(other) > 0;
    }

    public boolean isLessThan(ComparableProduct other) {
        return this.compareTo(other) < 0;
    }

    public ProductEnum getProduct() {
        return product;
    }

    public void setProduct(ProductEnum product) {
        this.product = product;
    }
}
