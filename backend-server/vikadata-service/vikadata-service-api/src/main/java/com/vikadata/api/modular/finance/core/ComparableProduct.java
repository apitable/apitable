package com.vikadata.api.modular.finance.core;

import com.vikadata.api.util.billing.model.ProductEnum;

/**
 * 订阅产品
 * @author Shawn Deng
 * @date 2022-05-13 21:47:31
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
