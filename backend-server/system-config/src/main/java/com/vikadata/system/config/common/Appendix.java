package com.vikadata.system.config.common;

import lombok.Data;

/**
 * 附件对象（统一）
 * @author Shawn Deng
 * @date 2022-01-12 16:26:20
 */
@Data
public class Appendix {

    private String id;

    private String name;

    private Long size;

    private String mimeType;

    private String token;

    private Integer width;

    private Integer height;

    private String url;

}
