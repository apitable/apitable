package com.vikadata.api.modular.vcode.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.model.vo.vcode.VCodeCouponPageVo;
import com.vikadata.api.model.vo.vcode.VCodeCouponVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：V码系统-兑换券模板表测试
 * </p>
 * @author wuyitao
 * @date 2022/4/5 5:38 PM
 */
@Disabled
public class VCodeCouponMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    VCodeCouponMapper vCodeCouponMapper;

    @Test
    @Sql("/testdata/code-coupon-template-data.sql")
    void testCountById() {
        Integer count = vCodeCouponMapper.countById(41L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/code-coupon-template-data.sql")
    void testSelectBaseInfo() {
        List<VCodeCouponVo> entities = vCodeCouponMapper.selectBaseInfo("comment");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/code-coupon-template-data.sql")
    void testSelectDetailInfo() {
        IPage<VCodeCouponPageVo> page = vCodeCouponMapper.selectDetailInfo(new Page(), "comment");
        assertThat(page.getTotal()).isEqualTo(1);
    }

}
