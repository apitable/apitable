package com.vikadata.api.modular.vcode.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.vikadata.api.model.vo.vcode.VCodeActivityPageVo;
import com.vikadata.api.model.vo.vcode.VCodeActivityVo;
import com.vikadata.entity.CodeActivityEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * V码系统-V码活动表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/14
 */
public interface VCodeActivityMapper extends BaseMapper<CodeActivityEntity> {

    /**
     * 获取所有活动的场景值
     *
     * @return scenes
     * @author Chambers
     * @date 2020/8/19
     */
    List<String> selectAllScene();

    /**
     * 查询表ID
     *
     * @param scene 场景值
     * @return ID
     * @author Chambers
     * @date 2020/8/24
     */
    Long selectIdByScene(@Param("scene") String scene);

    /**
     * 修改活动名称
     *
     * @param userId 用户ID
     * @param id     活动表ID
     * @param name   活动名称
     * @return 变更数
     * @author Chambers
     * @date 2020/8/19
     */
    int updateNameById(@Param("userId") Long userId, @Param("id") Long id, @Param("name") String name);

    /**
     * 修改活动名称
     *
     * @param userId 用户ID
     * @param id     活动表ID
     * @param scene  场景值
     * @return 变更数
     * @author Chambers
     * @date 2020/8/19
     */
    int updateSceneById(@Param("userId") Long userId, @Param("id") Long id, @Param("scene") String scene);

    /**
     * 逻辑删除
     *
     * @param userId 用户ID
     * @param id     表ID
     * @return 变更数
     * @author Chambers
     * @date 2020/8/14
     */
    int removeById(@Param("userId") Long userId, @Param("id") Long id);

    /**
     * 检查指定活动是否存在
     *
     * @param id 表ID
     * @return count
     * @author Chambers
     * @date 2020/8/20
     */
    Integer countById(@Param("id") Long id);

    /**
     * 获取活动基本信息
     *
     * @param keyword 搜索关键词
     * @return 基本信息
     * @author Chambers
     * @date 2020/8/19
     */
    List<VCodeActivityVo> selectBaseInfo(@Param("keyword") String keyword);

    /**
     * 分页获取活动详细信息
     *
     * @param page    分页请求对象
     * @param keyword 搜索关键词
     * @param appId   appId
     * @return 活动视图
     * @author Chambers
     * @date 2020/8/19
     */
    IPage<VCodeActivityPageVo> selectDetailInfo(Page<VCodeActivityPageVo> page, @Param("keyword") String keyword, @Param("appId") String appId);

    /**
     * 查询活动对应的二维码数量
     *
     * @param id    表ID
     * @param appId appId
     * @return 执行结果数
     * @author Chambers
     * @date 2020/8/24
     */
    Integer countQrCodeByIdAndAppId(@Param("id") Long id, @Param("appId") String appId);
}
