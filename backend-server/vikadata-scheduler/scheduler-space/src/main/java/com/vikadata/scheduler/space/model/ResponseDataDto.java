package com.vikadata.scheduler.space.model;

import com.vikadata.core.support.ResponseData;

public class ResponseDataDto<T>  extends ResponseData {

    public ResponseDataDto() {
        super(false, null, null);
    }

    public ResponseDataDto(Boolean success, Integer code, T data) {
        super(success, code, data);
    }

}
