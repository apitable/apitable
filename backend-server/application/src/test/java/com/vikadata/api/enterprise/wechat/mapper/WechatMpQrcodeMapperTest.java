package com.vikadata.api.enterprise.wechat.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.wechat.mapper.WechatMpQrcodeMapper;
import com.vikadata.api.enterprise.wechat.vo.QrCodePageVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 * Wechat Mp Qrcode Mapper Test
 * </p>
 */
@Disabled
public class WechatMpQrcodeMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    WechatMpQrcodeMapper wechatMpQrcodeMapper;

    @Test
    @Sql("/testdata/wechat-mp-qrcode-data.sql")
    void testSelectDetailInfo() {
        IPage<QrCodePageVo> page = wechatMpQrcodeMapper.selectDetailInfo(new Page<>(), "wx41");
        assertThat(page.getTotal()).isEqualTo(1);
    }

}
