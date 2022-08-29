package com.vikadata.api.model.vo.marketplace;

/**
 *
 *
 * @author Benson Cheung
 * @date 2021/3/31 下午2:12
 */

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.NullBooleanSerializer;

/**
 * 应用市场-空间站应用视图
 *
 * @author Benson Cheung
 * @date 2021/3/31 下午2:12
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("第三方平台集成-空间站应用视图")
public class MarketplaceSpaceAppVo {

    @ApiModelProperty(value = "应用ID", example = "app112", position = 1)
    private String appId;

    @ApiModelProperty(value = "此空间站是否已开通(0:否,1:是)", example = "0", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean status;

}
