package com.vikadata.api.modular.social.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.SocialUserEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 第三方平台集成-用户 Mapper
 *
 * @author Shawn Deng
 * @date 2020-12-07 11:21:22
 */
public interface SocialUserMapper extends BaseMapper<SocialUserEntity> {

    /**
     * 快速批量插入
     *
     * @param entities 成员列表
     * @return 执行结果数
     * @author Shawn Deng
     * @date 2019/12/17 20:34
     */
    int insertBatch(@Param("entities") List<SocialUserEntity> entities);

    /**
     * 根据OPEN_ID查询
     *
     * @param unionId 第三方平台用户标识
     * @return SocialUserEntity
     * @author Shawn Deng
     * @date 2020/12/15 11:43
     */
    SocialUserEntity selectByUnionId(@Param("unionId") String unionId);

    /**
     * 批量删除记录
     *
     * @param unionIds 第三方平台用户标识
     * @return 执行结果数
     * @author Shawn Deng
     * @date 2020/12/15 10:16
     */
    int deleteByUnionIds(@Param("unionIds") List<String> unionIds);
}
