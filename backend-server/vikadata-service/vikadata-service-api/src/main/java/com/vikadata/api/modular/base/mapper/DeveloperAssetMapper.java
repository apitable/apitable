package com.vikadata.api.modular.base.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.DeveloperAssetEntity;

/**
 * <p>
 * 开发者-附件表 Mapper 接口
 * </p>
 *
 * @author Pengap
 * @date 2021/7/21
 */
public interface DeveloperAssetMapper extends BaseMapper<DeveloperAssetEntity> {

    /**
     * 更新资源文件大小
     *
     * @param id           数据Id
     * @param incrFileSize 增量文件大小
     * @return int 执行结果数
     * @author Pengap
     * @date 2022/4/7 16:25:49
     */
    int updateFileSizeById(@Param("id") Long id, @Param("incrFileSize") Long incrFileSize);

}
