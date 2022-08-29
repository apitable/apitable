package com.vikadata.api.model.dto.marketplace;

import lombok.Data;

/**
 * <p>
 * 应用市场 空间站的应用信息
 * </p>
 *
 * @author Benson Cheung
 * @date 2021/3/31 下午3:23
 */
@Data
public class MarketplaceSpaceAppDto {

    private String appId;

    private String spaceId;

    private Boolean status;
}
