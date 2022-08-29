package com.vikadata.api.modular.wechat.mapper;

import java.util.List;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.vo.wechat.QrCodeBaseInfo;
import com.vikadata.api.model.vo.wechat.QrCodePageVo;
import com.vikadata.entity.WechatMpQrcodeEntity;

/**
 * <p>
 * 微信公众号二维码信息表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/18
 */
public interface WechatMpQrcodeMapper extends BaseMapper<WechatMpQrcodeEntity> {

    /**
     * 查询基本信息
     *
     * @param appId appId
     * @param scene 场景值
     * @return BaseInfo
     * @author Chambers
     * @date 2020/8/24
     */
    List<QrCodeBaseInfo> selectBaseInfo(@Param("appId") String appId, @Param("scene") String scene);

    /**
     * 分页查询详细信息
     *
     * @param page  分页请求对象
     * @param appId appId
     * @return QrCodePageVo
     * @author Chambers
     * @date 2020/8/24
     */
    @InterceptorIgnore(illegalSql = "1")
    IPage<QrCodePageVo> selectDetailInfo(Page<QrCodePageVo> page, @Param("appId") String appId);

    /**
     * 逻辑删除
     *
     * @param userId 用户ID
     * @param id     表ID
     * @param appId  appId
     * @return 执行结果数
     * @author Chambers
     * @date 2020/8/24
     */
    Integer removeByIdAndAppId(@Param("userId") Long userId, @Param("id") Long id, @Param("appId") String appId);
}
