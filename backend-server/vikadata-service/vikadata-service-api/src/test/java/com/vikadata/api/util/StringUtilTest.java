package com.vikadata.api.util;

import cn.hutool.core.lang.Dict;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *
 * </p>
 *
 * @author Pengap
 * @date 2021/12/29 17:17:45
 */
public class StringUtilTest {

    @Test
    public void templateReplacementTest() {
        String temp = "今天天气${test_1}，👋";
        String formatString = StringUtil.format(temp, Dict.create().set("test_1", "【下雨】"));
        String expectResult = "今天天气【下雨】，\uD83D\uDC4B";
        assertThat(formatString).isEqualTo(expectResult);
    }
}
