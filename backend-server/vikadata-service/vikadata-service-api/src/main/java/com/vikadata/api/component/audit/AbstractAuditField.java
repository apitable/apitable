package com.vikadata.api.component.audit;

import java.util.HashMap;
import java.util.HashSet;

/**
 * <p>
 * 审计字典基类
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/27 15:29
 */
public abstract class AbstractAuditField {

    protected HashMap<String, HashSet<String>> dictMap = new HashMap<>(16);

    protected HashMap<String, String> fieldWrapperDict = new HashMap<>(16);

    public AbstractAuditField() {
        init();
        initWrapper();
    }

    /**
     * 初始化审计字段
     *
     * @author Shawn Deng
     * @date 2020/3/27 15:57
     */
    protected abstract void init();

    /**
     * 初始化需要被包装的字段
     * 比如：member_id 包装成 member_name
     */
    protected abstract void initWrapper();

    public void put(String key, HashSet<String> value) {
        this.dictMap.put(key, value);
    }

    public HashSet<String> get(String key) {
        return this.dictMap.get(key);
    }

    public void putFieldWrapperMethodName(String key, String methodName) {
        this.fieldWrapperDict.put(key, methodName);
    }

    public HashMap<String, String> getFieldWrapperDict() {
        return this.fieldWrapperDict;
    }

    public String getFieldWrapperMethodName(String key) {
        return this.fieldWrapperDict.get(key);
    }
}
