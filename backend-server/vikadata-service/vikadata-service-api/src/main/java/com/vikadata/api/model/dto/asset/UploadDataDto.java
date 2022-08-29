package com.vikadata.api.model.dto.asset;

import lombok.Data;

/**
 * <p>
 * 上传数据对象模版
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/16 18:36
 */
@Data
public class UploadDataDto {

    private String name;

    private String email;

    private String team;

    private String position;

    private String jobNumber;
}
