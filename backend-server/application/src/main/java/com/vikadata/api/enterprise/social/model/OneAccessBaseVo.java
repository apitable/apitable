package com.vikadata.api.enterprise.social.model;

import java.io.Serializable;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


@Data
@ApiModel("OneAccess base information")
public class OneAccessBaseVo  implements Serializable {

    private static final long serialVersionUID = 6941456238190558553L;

    @ApiModelProperty(value = " The request ID sent by the OneAccess each time the interface is called", position = 1)
    private String bimRequestId;

    @ApiModelProperty(value = "The result code of the interface call processing", position = 3)
    private String resultCode;

    @ApiModelProperty(value = "Interface call processing information", position = 4)
    private String message;


    public OneAccessBaseVo(String bimRequestId){
        this.bimRequestId = bimRequestId;
        this.resultCode = "0";
        this.message = "success";
    }
}
