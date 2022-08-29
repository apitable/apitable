package com.vikadata.social.dingtalk.model;

import java.io.File;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p> 
 * 上传媒体文件
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/29 10:45
 */
@Setter
@Getter
@ToString
public class DingTalkMediaUploadRequest {
    private String type;

    private File media;
}
