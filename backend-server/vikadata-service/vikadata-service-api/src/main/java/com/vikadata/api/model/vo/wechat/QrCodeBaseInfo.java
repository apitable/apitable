package com.vikadata.api.model.vo.wechat;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.vikadata.api.support.serializer.QrcodePreSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 二维码基本信息
 * </p>
 *
 * @author Chambers
 * @date 2020/8/24
 */
@Data
@ApiModel("二维码基本信息")
public class QrCodeBaseInfo {

    @ApiModelProperty(value = "二维码ID", dataType = "java.lang.String", example = "1456", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long qrCodeId;

    @ApiModelProperty(value = "类型", example = "临时整型值:QR_SCENE、临时字符串值：QR_STR_SCENE;永久整型值:QR_LIMIT_SCENE、永久字符串值：QR_LIMIT_STR_SCENE", position = 2)
    private String type;

    @ApiModelProperty(value = "二维码图片", example = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQH47joAAA", position = 3)
    @JsonSerialize(using = QrcodePreSerializer.class)
    private String image;

    @ApiModelProperty(value = "二维码图片解析后的地址，可自行生成二维码图片", example = "http://weixin.qq.com/q/kZgfwMTm72WWPkovabbI", position = 4)
    private String url;
}
