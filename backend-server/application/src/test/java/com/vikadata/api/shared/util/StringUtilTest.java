package com.vikadata.api.shared.util;

import cn.hutool.core.lang.Dict;
import org.junit.jupiter.api.Test;

import com.vikadata.api.shared.util.StringUtil;

import static org.assertj.core.api.Assertions.assertThat;

public class StringUtilTest {

    @Test
    public void templateReplacementTest() {
        String temp = "Today's weather ${test_1}, 👋";
        String formatString = StringUtil.format(temp, Dict.create().set("test_1", "[rain]"));
        String expectResult = "Today's weather [rain], \uD83D\uDC4B";
        assertThat(formatString).isEqualTo(expectResult);
    }
}
