package com.vikadata.api.modular.base.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.AssetEntity;

/**
 * <p>
 * 基础-附件表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @since 2020-03-06
 */
public interface AssetMapper extends BaseMapper<AssetEntity> {

    /**
     * 获取摘要相同的附件ID、云端保存文件名
     *
     * @param checksum md5摘要
     * @return dto
     * @author Chambers
     * @date 2019/12/25
     */
    AssetEntity selectByChecksum(@Param("checksum") String checksum);

    /**
     * 查询文件拓展名
     *
     * @param fileUrl 云端文件名
     * @return 拓展名
     * @author Chambers
     * @date 2020/3/7
     */
    String selectExtensionNameByFileUrl(@Param("fileUrl") String fileUrl);

    /**
     * 获取checksum和ID
     *
     * @param fileUrls 云端文件存放路径
     * @return List<AssetChecksumDto>
     * @author zoe zheng
     * @date 2020/12/24 12:12 下午
     */
    List<AssetEntity> selectByFileUrl(@Param("fileUrls") Collection<String> fileUrls);

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
