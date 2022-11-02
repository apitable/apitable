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
 * WeChat Mp Qrcode Mapper
 * </p>
 */
public interface WechatMpQrcodeMapper extends BaseMapper<WechatMpQrcodeEntity> {

    /**
     * Query Info
     */
    List<QrCodeBaseInfo> selectBaseInfo(@Param("appId") String appId, @Param("scene") String scene);

    /**
     * Query detail page
     */
    @InterceptorIgnore(illegalSql = "1")
    IPage<QrCodePageVo> selectDetailInfo(Page<QrCodePageVo> page, @Param("appId") String appId);

    /**
     * Update delete status
     */
    Integer removeByIdAndAppId(@Param("userId") Long userId, @Param("id") Long id, @Param("appId") String appId);
}
