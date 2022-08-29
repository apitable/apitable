package com.vikadata.api.modular.vcode.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.api.model.dto.vcode.VCodeDTO;
import com.vikadata.entity.CodeUsageEntity;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * V码系统-V码记录表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/19
 */
public interface VCodeUsageMapper extends BaseMapper<CodeUsageEntity> {

    /**
     * 获取 V 码指定类型的操作次数
     *
     * @param code     V 码
     * @param type     类型
     * @param operator 操作者ID（非必须）
     * @return count
     * @author Chambers
     * @date 2020/8/28
     */
    Integer countByCodeAndType(@Param("code") String code, @Param("type") Integer type, @Param("operator") Long operator);

    /**
     * 获取邀请者的用户ID、vCode
     *
     * @param userId 受邀者用户ID
     * @return VCodeDTO
     * @author Chambers
     * @date 2021/6/30
     */
    VCodeDTO selectInvitorUserId(@Param("userId") Long userId);
}
