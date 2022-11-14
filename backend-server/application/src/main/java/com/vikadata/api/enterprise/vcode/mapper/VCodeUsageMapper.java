package com.vikadata.api.enterprise.vcode.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.api.enterprise.vcode.dto.VCodeDTO;
import com.vikadata.entity.CodeUsageEntity;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * VCode Usage Mapper
 * </p>
 */
public interface VCodeUsageMapper extends BaseMapper<CodeUsageEntity> {

    /**
     * Get the number of operations of the specified type of VCode
     */
    Integer countByCodeAndType(@Param("code") String code, @Param("type") Integer type, @Param("operator") Long operator);

    /**
     * Get the user information of the inviter
     */
    VCodeDTO selectInvitorUserId(@Param("userId") Long userId);
}
