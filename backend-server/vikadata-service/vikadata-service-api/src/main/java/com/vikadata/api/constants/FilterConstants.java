package com.vikadata.api.constants;

import org.springframework.core.Ordered;

/**
 * <p>
 * filter order constants
 * </p>
 *
 * @author Shawn Deng
 */
public class FilterConstants {

    private static final int INTERVAL = 2;

    public static final int FIRST_ORDERED = Ordered.LOWEST_PRECEDENCE - 99;

    public static final int MDC_INSERTING_SERVLET_FILTER = FIRST_ORDERED + INTERVAL;

    public static final int REQUEST_THREAD_HOLDER_FILTER = FIRST_ORDERED + INTERVAL * 2;

    public static final int TRACE_REQUEST_FILTER = FIRST_ORDERED + INTERVAL * 3;
}
