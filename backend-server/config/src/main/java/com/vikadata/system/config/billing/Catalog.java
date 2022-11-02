package com.vikadata.system.config.billing;

import lombok.Data;

import java.util.List;

/**
 * <p>
 * Catalog
 * </p>
 */
@Data
public class Catalog {

    private String id;

    private String version;

    private String catalogName;

    private String effectiveDate;

    private List<String> products;

    private boolean online;
}
