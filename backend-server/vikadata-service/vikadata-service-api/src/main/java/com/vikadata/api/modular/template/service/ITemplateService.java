package com.vikadata.api.modular.template.service;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.exception.TemplateException;
import com.vikadata.api.model.ro.config.TemplateConfigRo;
import com.vikadata.api.model.ro.template.CreateTemplateRo;
import com.vikadata.api.model.vo.template.RecommendVo;
import com.vikadata.api.model.vo.template.TemplateCategoryContentVo;
import com.vikadata.api.model.vo.template.TemplateCategoryMenuVo;
import com.vikadata.api.model.vo.template.TemplateDirectoryVo;
import com.vikadata.api.model.vo.template.TemplateSearchResult;
import com.vikadata.api.model.vo.template.TemplateVo;
import com.vikadata.api.modular.template.model.TemplateSearchDTO;
import com.vikadata.entity.TemplateEntity;

/**
 * <p>
 * 模板中心-模版 服务类
 * </p>
 *
 * @author Chambers
 * @date 2020/5/12
 */
public interface ITemplateService extends IService<TemplateEntity> {

    /**
     * 获取空间ID
     *
     * @param templateId   模板ID
     * @return spaceId
     * @author Chambers
     * @date 2021/1/25
     */
    String getSpaceId(String templateId);

    /**
     * 校验创建模版节点要求
     *
     * @param memberId 成员ID
     * @param nodeId   节点ID
     * @author liuzijing
     * @date 2022/7/21
     */
    void checkTemplateForeignNode(Long memberId, String nodeId);

    /**
     * 检验创建文件夹模版节点要求
     *
     * @param subNodeIds 所有子后代节点集合
     * @param memberId   成员ID
     * @author liuzijing
     * @date 2022/7/29
     */
    void checkFolderTemplate(List<String> subNodeIds, Long memberId);

    /**
     * 检验创建数表模版节点要求
     *
     * @param nodeIds           节点ID集合
     * @param isBuildNodeName   是否构建节点名称
     * @param templateException 异常名称
     * @author liuzijing
     * @date 2022/7/29
     */
    void checkDatasheetTemplate(List<String> nodeIds, Boolean isBuildNodeName, TemplateException templateException);

    /**
     * 检验收集表或者镜像是否关联外表
     *
     * @param subNodeIds           所有子后代节点集合
     * @param nodeTypeToNodeIdsMap 节点类型对应数表Map
     * @param nodeType             节点类型
     * @param templateException    异常类型
     * @author liuzijing
     * @date 2022/7/29
     */
    void checkFormOrMirrorIsForeignNode(List<String> subNodeIds, Map<Integer, List<String>> nodeTypeToNodeIdsMap, int nodeType, TemplateException templateException);

    /**
     * 检验数表所有字段权限
     *
     * @param memberId 成员ID
     * @param nodeId   节点ID
     * @author liuzijing
     * @date 2022/7/29
     */
    void checkFieldPermission(Long memberId, String nodeId);

    /**
     * 创建模版
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @param ro      请求参数
     * @return 模板ID
     * @author Chambers
     * @date 2020/5/18
     */
    String create(Long userId, String spaceId, CreateTemplateRo ro);

    /**
     * 删除模板
     *
     * @param userId        用户ID
     * @param templateId    模板ID
     * @author Chambers
     * @date 2021/7/23
     */
    void delete(Long userId, String templateId);

    /**
     * 获取热门推荐
     *
     * @param lang 语言
     * @return 热门推荐视图
     * @author Chambers
     * @date 2020/7/9
     */
    RecommendVo getRecommend(String lang);

    /**
     * 获取官方模版分类列表
     *
     * @param lang 语言
     * @return 模版分类视图
     * @author Chambers
     * @date 2020/7/8
     */
    List<TemplateCategoryMenuVo> getTemplateCategoryList(String lang);

    /**
     * get template category content view
     *
     * @param categoryCode template category property code
     * @return TemplateCategoryContentVo
     * @author Chambers
     * @date 2022/9/27
     */
    TemplateCategoryContentVo getTemplateCategoryContentVo(String categoryCode);

    /**
     * 获取模板视图列表
     *
     * @param spaceId      空间ID
     * @param categoryCode 模板分类code（非必须）
     * @param templateIds  模板ID列表（非必须）
     * @param isPrivate    是否属于空间站
     * @return 模板视图列表
     * @author Chambers
     * @date 2020/5/23
     */
    List<TemplateVo> getTemplateVoList(String spaceId, String categoryCode, List<String> templateIds, Boolean isPrivate);

    /**
     * 获取模板目录信息
     *
     * @param categoryCode 模板分类code（非必须）
     * @param templateId   模板ID
     * @param isPrivate    是否属于空间站
     * @param lang         语言
     * @return 模板目录vo
     * @author Chambers
     * @date 2020/5/25
     */
    TemplateDirectoryVo getDirectoryVo(String categoryCode, String templateId, Boolean isPrivate, String lang);

    /**
     * 一键生成模板
     *
     * @param userId   用户ID
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @param nodeId   节点ID
     * @return result
     * @author Chambers
     * @date 2020/6/23
     */
    String oneClickGenerate(Long userId, String spaceId, Long memberId, String nodeId);

    /**
     * 生成模板中心相关的配置
     *
     * @param userId   用户ID
     * @param ro 模板配置
     * @author Chambers
     * @date 2020/7/6
     */
    @Deprecated
    void config(Long userId, TemplateConfigRo ro);

    /**
     * 获取新空间默认引用模板的节点ID
     *
     * @return nodeId
     * @author Chambers
     * @date 2020/9/2
     */
    String getDefaultTemplateNodeId();

    /**
     * 模糊搜索模板
     *
     * @param keyword 搜索词
     * @param lang    语言
     * @return result
     * @author Chambers
     * @date 2020/11/2
     */
    List<TemplateSearchResult> searchTemplate(String keyword, String lang);

    /**
     * fuzzy search template related content
     *
     * @param lang      i18n
     * @param keyword   search keyword
     * @param lang      keyword highlight style class name
     * @return TemplateSearchDTO
     * @author Chambers
     * @date 2022/9/28
     */
    TemplateSearchDTO globalSearchTemplate(String lang, String keyword, String className);

    /**
     * 获取模板内的所有节点ID
     *
     * @param templateId    模板ID
     * @return nodeIds
     * @author Chambers
     * @date 2022/8/15
     */
    List<String> getNodeIdsByTemplateId(String templateId);
}
