package com.vikadata.scheduler.bill.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.MemberEntity;

/**
 * <p>
 *
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/22 12:28
 */
@Mapper
public interface MemberMapper extends BaseMapper<MemberEntity> {

    /**
     * 查询成员对应的用户ID
     *
     * @param id 成员ID
     * @return 用户ID
     * @author Shawn Deng
     * @date 2020/8/25 19:00
     */
    Long selectUserIdById(@Param("id") Long id);
}
