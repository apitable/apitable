package com.vikadata.social.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 媒体文件类型
 */
@Getter
@AllArgsConstructor
public enum DingTalkMediaType {

    /**
     * 图片，图片最大1MB。支持上传jpg、gif、png、bmp格式
     */
    IMAGE("image"),

    /**
     * 语音，语音文件最大2MB。支持上传amr、mp3、wav格式
     */
    VOICE("voice"),

    /**
     * 视频，视频最大10MB。支持上传mp4格式
     */
    VIDEO("video"),
    /**
     * 普通文件，最大10MB。支持上传doc、docx、xls、xlsx、ppt、pptx、zip、pdf、rar格式
     */
    FILE("file");

    private final String value;

    public String getValue() {
        return this.value;
    }

    public static DingTalkMediaType of(String value) {
        for (DingTalkMediaType dingTalkMediaType : DingTalkMediaType.values()) {
            if (dingTalkMediaType.value.equals(value)) {
                return dingTalkMediaType;
            }
        }
        throw new IllegalStateException("未知媒体文件类型");
    }
}
