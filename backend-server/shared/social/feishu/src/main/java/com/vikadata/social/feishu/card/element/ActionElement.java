package com.vikadata.social.feishu.card.element;

import java.util.HashMap;
import java.util.Map;

/**
 * Element abstract base class
 */
public abstract class ActionElement extends Element {

    public static final String METHOD_NAME_KEY = "__METHOD__";

    private String methodName;

    private Map<String, String> value = new HashMap<>(4);

    public ActionElement(String tag, String methodName) {
        super(tag);
        this.methodName = methodName;
        if (value != null) {
            value.put(METHOD_NAME_KEY, methodName);
        }
    }

    public ActionElement() {
    }

    public ActionElement(String tag) {
        super(tag);
    }

    public String getMethodName() {
        return methodName;
    }

    public Map<String, String> getValue() {
        return value;
    }

    protected void addActionValues(Map<String, String> value) {
        this.value.putAll(value);
    }
}
