package com.vikadata.system.config.marketplace;

import lombok.Data;

/**
 *
 * @author Shawn Deng
 * @date 2021-11-11 15:31:06
 */
@Data
public class Image {

    private String id;

    private String name;

    private long size;

    private String mimeType;

    private String token;

    private long width;

    private long height;

    private String url;
}
