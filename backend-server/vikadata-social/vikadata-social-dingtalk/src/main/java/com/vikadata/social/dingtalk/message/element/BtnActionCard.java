package com.vikadata.social.dingtalk.message.element;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.message.Component;

/**
 * <p>
 * 卡片内容基础属性
 * </p>
 * @author zoe zheng
 * @date 2021/4/21 2:51 下午
 */
@Getter
@Setter
public class BtnActionCard extends ActionCard implements Component {
    /**
     * 使用独立跳转ActionCard样式时的按钮排列方式
     * 0：竖直排列, 1：横向排列
     */
    private String btnOrientation;

    private List<BtnJson> btnJsonList;

    @Override
    public Object toObj() {
        Map<String, Object> map = new HashMap<>(4);
        map.put("title", getTitle());
        map.put("markdown", getMarkdown());
        map.put("btn_orientation", btnOrientation);
        map.put("btn_json_list", btnJsonList.stream().map(BtnJson::toObj).collect(Collectors.toList()));
        return map;
    }

    @Builder
    @Getter
    @Setter
    @ToString
    public static class BtnJson implements Component {
        private String title;

        private String actionUrl;

        @Override
        public Object toObj() {
            Map<String, Object> map = new HashMap<>(2);
            map.put("title", getTitle());
            map.put("action_url", getActionUrl());
            return map;
        }
    }

}
