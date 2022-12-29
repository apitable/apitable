package com.vikadata.api.template.service;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.template.enums.TemplateException;
import com.vikadata.api.template.ro.CreateTemplateRo;
import com.vikadata.api.template.vo.RecommendVo;
import com.vikadata.api.template.vo.TemplateCategoryContentVo;
import com.vikadata.api.template.vo.TemplateCategoryMenuVo;
import com.vikadata.api.template.vo.TemplateDirectoryVo;
import com.vikadata.api.template.vo.TemplateVo;
import com.vikadata.api.template.model.TemplateSearchDTO;
import com.vikadata.entity.TemplateEntity;

/**
 * <p>
 * Template Service
 * </p>
 */
public interface ITemplateService extends IService<TemplateEntity> {

    /**
     * Get space id by template id
     */
    String getSpaceId(String templateId);

    /**
     * Verify the requirements for creating a template node
     */
    void checkTemplateForeignNode(Long memberId, String nodeId);

    /**
     * Verify the requirements for creating a folder template node
     */
    void checkFolderTemplate(List<String> subNodeIds, Long memberId);

    /**
     * Verify the requirements for creating a table template node
     */
    void checkDatasheetTemplate(List<String> nodeIds, Boolean isBuildNodeName, TemplateException templateException);

    /**
     * Verify that the collection table or mirror is associated with the foreign table
     */
    void checkFormOrMirrorIsForeignNode(List<String> subNodeIds, Map<Integer, List<String>> nodeTypeToNodeIdsMap, int nodeType, TemplateException templateException);

    /**
     * Checklist all field permissions
     */
    void checkFieldPermission(Long memberId, String nodeId);

    /**
     * Create template
     */
    String create(Long userId, String spaceId, CreateTemplateRo ro);

    /**
     * Delete template
     */
    void delete(Long userId, String templateId);

    /**
     * Get recommend view
     */
    RecommendVo getRecommend(String lang);

    /**
     * Get official template category list
     */
    List<TemplateCategoryMenuVo> getTemplateCategoryList(String lang);

    /**
     * Get template category content view
     */
    TemplateCategoryContentVo getTemplateCategoryContentVo(String categoryCode);

    /**
     * Get template view list
     *
     * @param spaceId      space id
     * @param categoryCode template category code(no require)
     * @param templateIds  template id list(no require)
     * @param isPrivate    whether it is a private template in the space station
     * @return TemplateVo List
     */
    List<TemplateVo> getTemplateVoList(String spaceId, String categoryCode, List<String> templateIds, Boolean isPrivate);

    /**
     * Get template directory view
     *
     * @param categoryCode template category code(no require)
     * @param templateId   template id
     * @param isPrivate    whether it is a private template in the space station
     * @param lang         language
     * @return TemplateDirectoryVo
     */
    TemplateDirectoryVo getDirectoryVo(String categoryCode, String templateId, Boolean isPrivate, String lang);

    /**
     * Get default template node id
     */
    String getDefaultTemplateNodeId();

    /**
     * fuzzy search template related content
     */
    TemplateSearchDTO globalSearchTemplate(String lang, String keyword, String className);

    /**
     * Get all node id list inside the template
     */
    List<String> getNodeIdsByTemplateId(String templateId);
}
