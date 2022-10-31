package com.vikadata.boot.autoconfigure;

import org.springframework.core.Ordered;

/**
 * Execution order of all filters
 * @author Shawn Deng
 */
public class FilterChainOrdered {

    public static final int MIDUN_CAS_FILTER = Ordered.LOWEST_PRECEDENCE - 100;
}
