package com.vikadata.api.modular.space.model;

import lombok.Data;

/**
 * space capacity info
 *
 * @author liuzijing
 * @date 2022/8/31
 */
@Data
public class SpaceCapacityUsedInfo {

    /**
     * subscription package capacity used sizes
     */
    private Long currentBundleCapacityUsedSizes;

    /**
     * gift capacity used sizes
     */
    private Long giftCapacityUsedSizes;
}
