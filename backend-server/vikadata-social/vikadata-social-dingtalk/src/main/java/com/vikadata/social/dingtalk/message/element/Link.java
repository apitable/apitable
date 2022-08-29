package com.vikadata.social.dingtalk.message.element;

import java.util.HashMap;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

import com.vikadata.social.dingtalk.message.AbstractElement;
import com.vikadata.social.dingtalk.message.Component;

/**
 * <p>
 * 链接消息
 * </p>
 * @author zoe zheng
 * @date 2021/4/21 3:42 下午
 */
@Getter
@Setter
public class Link extends AbstractElement implements Component {
    /**
     * 消息点击链接地址，当发送消息为小程序时支持小程序跳转链接。
     * 消息链接跳转，请参考消息链接说明。
     */
    private String messageUrl;

    /**
     * 图片地址，可以通过上传媒体文件接口获取。
     */
    private String picUrl;

    /**
     * 消息描述，建议500字符以内。
     */
    private String text;

    @Override
    public Object toObj() {
        Map<String, String> map = new HashMap<>(4);
        map.put("title", getTitle());
        map.put("text", text);
        map.put("messageUrl", messageUrl);
        map.put("picUrl", picUrl);
        return map;
    }
}
