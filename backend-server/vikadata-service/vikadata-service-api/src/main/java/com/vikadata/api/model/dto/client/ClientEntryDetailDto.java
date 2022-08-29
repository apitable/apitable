package com.vikadata.api.model.dto.client;

import lombok.Data;

/**
 * <p>
 * 客户端htmlContentDto
 * </p>
 *
 * @author zoe zheng
 * @date 2020/4/15 11:23 上午
 */
@Data
public class ClientEntryDetailDto {

    /**
     * ID
     */
    private Long id;

    /**
     * htmlContent
     */
    private String htmlContent;

    private String version;

    private String publishUser;

    private String description;
}
