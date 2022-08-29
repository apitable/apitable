package com.vikadata.system.config.billing;

import lombok.Data;

import java.util.List;

/**
 * <p>
 * 目录
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/8/31 15:13
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
