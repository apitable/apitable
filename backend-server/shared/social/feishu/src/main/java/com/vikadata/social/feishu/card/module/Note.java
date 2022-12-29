package com.vikadata.social.feishu.card.module;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.vikadata.social.feishu.card.CardComponent;
import com.vikadata.social.feishu.card.element.Image;
import com.vikadata.social.feishu.card.objects.Text;

/**
 * Note module
 */
public class Note extends Module {

    private List<CardComponent> elements;

    public Note() {
    }

    public Note(List<CardComponent> elements) {
        super("note");
        // Only supports Text and Image
        this.elements = elements.stream()
                .filter(c -> (c instanceof Text) || (c instanceof Image))
                .collect(Collectors.toList());
    }

    @Override
    public Object toObj() {
        Map<String, Object> map = new HashMap<>(16);
        map.put("tag", getTag());
        map.put("elements", elements.stream().map(CardComponent::toObj).collect(Collectors.toList()));
        return map;
    }
}
