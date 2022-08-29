package com.vikadata.social.feishu.card.module;

import cn.hutool.core.map.MapUtil;

/**
 * <p>
 * 分割线模块
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 16:22
 */
public class Hr extends Module {

    public Hr() {
        super("hr");
    }

    @Override
    public Object toObj() {
        return MapUtil.of("tag", getTag());
    }
}
