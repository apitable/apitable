package com.vikadata.social.feishu.card;

import com.vikadata.social.feishu.card.module.Module;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * <p>
 * 消息卡片结构
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 11:52
 */
public class Card implements CardComponent {

    /**
     * 卡片配置
     */
    private Config config;

    /**
     * 卡片标题
     */
    private Header header;

    /**
     * 非多语言环境，直接定义副本
     */
    private List<Module> elements;

    /**
     * 多语言副本, 替代 elements
     */
    private Map<String, List<Module>> i18nElements;

    public Card() {
    }

    public Card(Config config, Header header) {
        this.config = config;
        this.header = header;
    }

    public void setModules(List<Module> l) {
        elements = l;
    }

    public void setZhCnModules(List<Module> l) {
        ensureI18nElements();
        i18nElements.put("zh_cn", l);
    }

    public void setEnUsModules(List<Module> l) {
        ensureI18nElements();
        i18nElements.put("en_us", l);
    }

    public void setJaJpModules(List<Module> l) {
        ensureI18nElements();
        i18nElements.put("ja_jp", l);
    }

    private void ensureI18nElements() {
        if (i18nElements == null) {
            i18nElements = new HashMap<>(3);
        }
    }

    @Override
    public Object toObj() {
        Map<String, Object> map = new HashMap<>(16);

        if (header != null) {
            map.put("header", header.toObj());
        }

        if (config != null) {
            map.put("config", config.toObj());
        }

        if (elements != null) {
            map.put("elements", elements.stream().map(CardComponent::toObj).collect(Collectors.toList()));
        }

        if (i18nElements != null) {
            map.put("i18n_elements",
                i18nElements.entrySet().stream().collect(Collectors.toMap(
                    Map.Entry::getKey,
                    e -> e.getValue().stream().map(CardComponent::toObj).collect(Collectors.toList()))
                )
            );
        }

        return map;
    }
}
