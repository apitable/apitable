package com.vikadata.api.modular.template.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.modular.template.model.TemplateKeyWordSearchDto;
import com.vikadata.api.modular.template.model.TemplatePropertyDto;
import com.vikadata.api.modular.template.model.TemplatePropertyRelDto;
import com.vikadata.entity.TemplatePropertyEntity;

/**
 * <p>
 * 模板中心-模版属性 Mapper 接口
 * </p>
 * @author zoe zheng
 * @date 2021/8/2 5:00 下午
 */
public interface TemplatePropertyMapper extends BaseMapper<TemplatePropertyEntity> {

    /**
     * 获取指定语言在线模版基本信息
     *
     * @param lang 特定语言
     * @return List<OnlineTemplateInfoDto>
     * @author wuyitao
     */
    List<TemplatePropertyDto> selectTemplatePropertiesWithI18n(@Param("lang") String lang);

    /**
     * 获取排序之后的模版属性的基本信息
     *
     * @param type 模版类型
     * @param lang 语言
     * @return List<TemplatePropertyDto>
     * @author zoe zheng
     * @date 2021/8/3 4:50 下午
     */
    List<TemplatePropertyDto> selectTemplatePropertiesWithLangAndOrder(@Param("type") Integer type, @Param("lang") String lang);

    /**
     * 批量写入
     *
     * @param entities 实体数据
     * @return 影响行数
     * @author zoe zheng
     * @date 2021/8/2 7:59 下午
     */
    int insertBatch(@Param("entities") List<TemplatePropertyEntity> entities);

    /**
     * 根据ID批量删除
     *
     * @param ids 属性ID
     * @param updatedBy 更新人id
     * @return 影响行数
     * @author zoe zheng
     * @date 2021/8/3 11:50 上午
     */
    int deleteBatchByIds(@Param("ids") List<Long> ids, @Param("updatedBy")Long updatedBy);

    /**
     * 根据code查询属性ID
     *
     * @param code 属性code
     * @param type 属性type
     * @return 属性Id
     * @author zoe zheng
     * @date 2021/8/3 2:48 下午
     */
    Long selectIdByCodeAndType(@Param("code") String code, @Param("type") Integer type);

    /**
     * 根据模版ID和类型查询属性
     *
     * @param templateIds 模版ID
     * @param type 属性类型
     * @return List<TemplatePropertyDto>
     * @author zoe zheng
     * @date 2021/8/3 3:02 下午
     */
    List<TemplatePropertyRelDto> selectPropertiesByTemplateIdsAndType(@Param("templateIds") List<String> templateIds,
            @Param("type") Integer type);

    /**
     * 根据模版ID和标签名称搜索模版
     *
     * @param keyWord 关键字
     * @param lang 语言
     * @return 模版结果
     * @author zoe zheng
     * @date 2021/8/4 10:34 上午
     */
    List<TemplateKeyWordSearchDto> selectTemplateByPropertyNameAndLang(@Param("keyWord") String keyWord, @Param("lang")String lang);

    /**
     * 批量删除
     *
     * @return 删除条数
     * @author zoe zheng
     * @date 2021/8/2 5:06 下午
     */
    int deleteBatch();

    /**
     * 返回某语言下的分类行数
     * @param lang 语言
     * @return 行数
     */
    int countByI18n(@Param("lang") String lang);
}
