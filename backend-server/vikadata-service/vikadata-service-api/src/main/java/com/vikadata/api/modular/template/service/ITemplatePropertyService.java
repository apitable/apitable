package com.vikadata.api.modular.template.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.cache.bean.CategoryDto;
import com.vikadata.api.enums.template.TemplatePropertyType;
import com.vikadata.api.modular.template.model.TemplatePropertyDto;
import com.vikadata.api.modular.template.model.TemplatePropertyRelDto;
import com.vikadata.entity.TemplatePropertyEntity;

/**
 * <p>
 * 模板中心-模版 服务类
 * </p>
 *
 * @author Chambers
 * @date 2020/5/12
 */
public interface ITemplatePropertyService extends IService<TemplatePropertyEntity> {

    /**
     * 获取排序之后的在线模版基本信息
     *
     * @param type 属性类型 可以为null,查询全部
     * @param lang 语言
     * @return List<TemplatePropertyDto>
     * @author zoe zheng
     * @date 2021/8/3 4:54 下午
     */
    List<TemplatePropertyDto> getTemplatePropertiesWithLangAndOrder(TemplatePropertyType type, String lang);

    /**
     * 配置模版属性
     *
     * @param nodeId 模版配置表ID
     * @param nameToTplIdMap 模版名字ID对应的map
     * @param operatorUserId 操作用户ID
     * @param lang 语言
     * @param templateCategoryNames 模板分类
     * @author zoe zheng
     * @date 2021/8/3 10:58 上午
     */
    void configOnlineTemplate(String nodeId, Map<String, String> nameToTplIdMap, Long operatorUserId, String lang, List<String> templateCategoryNames);

    /**
     * 根据code查询属性ID
     *
     * @param code 属性code
     * @param type 属性type
     * @return 属性Id
     * @author zoe zheng
     * @date 2021/8/3 2:48 下午
     */
    Long getIdByCodeAndType(String code, TemplatePropertyType type);

    /**
     * 根据属性code和类型获取对应的模版ID
     *
     * @param code 属性code
     * @param type 属性type
     * @return 模版ID
     * @author zoe zheng
     * @date 2021/8/3 2:53 下午
     */
    List<String> getTemplateIdsByPropertyCodeAndType(String code, TemplatePropertyType type);

    /**
     * 根据模版ID和类型查询属性
     *
     * @param templateIds 模版ID
     * @return List<TemplatePropertyDto>
     * @author zoe zheng
     * @date 2021/8/3 3:02 下午
     */
    List<TemplatePropertyRelDto> getPropertyByTemplateIds(List<String> templateIds, TemplatePropertyType type);

    /**
     * 获取模版的标签列表
     *
     * @param templateIds 模版ID
     * @return Map<String, List < String>> 模版ID->标签名称
     * @author zoe zheng
     * @date 2021/8/3 3:16 下午
     */
    Map<String, List<String>> getTemplatesTags(List<String> templateIds);

    /**
     * 指定语言根据模版ID和标签名称搜索模版
     *
     * @param keyWord 模糊匹配关键字
     * @param lang 语言
     * @return 模版结果
     * @author zoe zheng
     * @date 2021/8/4 10:34 上午
     */
    LinkedHashSet<String> getTemplateIdsByKeyWordAndLang(String keyWord, String lang);

    /**
     * 如果某语言下没有分类配置，返回"zh_CN"，若有则原值返回。
     * @param lang 语言
     * @return 配置所属语言
     */
    String ifNotCategoryReturnDefaultElseRaw(String lang);

    /**
     * 返回官方分类的分组
     * @param lang 语言
     * @return 某语言的分类列表
     */
    List<CategoryDto> getCategories(String lang);
}
