package com.vikadata.api.mediator;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 通讯录 中介者
 *
 * @author Shawn Deng
 * @date 2020-11-27 10:54:49
 */
public abstract class AbstractContactMediator {

    protected List<ContactSource> contactSource;

    protected Map<ContactSource, List<ContactSource>> sourceDependency = new HashMap<>(16);

    public void register(ContactSource source) {
        contactSource.add(source);
    }

    public void register() {

    }

    protected abstract void sync(Object data);
}
