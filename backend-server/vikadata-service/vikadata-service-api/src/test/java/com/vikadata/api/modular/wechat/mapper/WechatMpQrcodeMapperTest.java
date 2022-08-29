package com.vikadata.api.modular.wechat.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.model.vo.wechat.QrCodePageVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：第三方系统-微信公众号二维码信息表测试
 * </p>
 * @author wuyitao
 * @date 2022/4/6 1:27 PM
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
