package com.vikadata.api.model.vo.wechat;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullStringSerializer;
import com.vikadata.api.support.serializer.QrcodePreSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 公众号二维码vo
 * </p>
 *
 * @author Chambers
 * @date 2020/8/10
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("公众号二维码vo")
public class QrCodeVo {

    @ApiModelProperty(value = "唯一标识", example = "fa23r2thu", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String mark;

    @ApiModelProperty(value = "二维码图片", example = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQH47joAAA", position = 2)
    @JsonSerialize(using = QrcodePreSerializer.class)
    private String image;

    @ApiModelProperty(value = "二维码图片解析后的地址，可自行生成二维码图片", example = "http://weixin.qq.com/q/kZgfwMTm72WWPkovabbI", position = 3)
    private String url;
}
