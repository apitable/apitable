package com.vikadata.api.modular.template.mapper;

import java.util.List;
import java.util.Set;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.template.TemplateDto;
import com.vikadata.api.model.dto.template.TemplateInfo;
import com.vikadata.api.modular.template.model.OnlineTemplateDto;
import com.vikadata.entity.TemplateEntity;

/**
 * <p>
 * 模板中心-模版 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @since 2020/5/12
 */
public interface TemplateMapper extends BaseMapper<TemplateEntity> {

    /**
     * 获取指定类型ID的模板总数
     *
     * @param typeId 类型ID
     * @return 总数
     * @author Chambers
     * @date 2020/5/20
     */
    Integer countByTypeId(@Param("typeId") String typeId);

    /**
     * 通过类型ID和名称，获取表ID
     *
     * @param typeId 类型ID
     * @param name   模板名称
     * @return 表ID
     * @author Chambers
     * @date 2020/5/20
     */
    Long selectIdByTypeIdAndName(@Param("typeId") String typeId, @Param("name") String name);

    /**
     * 获取模板映射的节点ID
     *
     * @param templateId 自定义模板ID
     * @return 节点ID
     * @author Chambers
     * @date 2020/5/23
     */
    String selectNodeIdByTempId(@Param("templateId") String templateId);

    /**
     * 根据 templateId 查询空间ID
     *
     * @param templateId 自定义模板ID
     * @return 空间ID
     * @author Pengap
     * @date 2022/6/7 16:48:18
     */
    String selectSpaceIdByTemplateIdIncludeDeleted(@Param("templateId") String templateId);

    /**
     * 查询模板名称
     *
     * @param templateId 自定义模板ID
     * @return 模板名称
     * @author Chambers
     * @date 2021/7/22
     */
    String selectNameByTemplateIdIncludeDelete(@Param("templateId") String templateId);

    /**
     * 获取最后修改者
     *
     * @param templateId 自定义模板ID
     * @return 用户ID
     * @author Chambers
     * @date 2020/5/23
     */
    Long selectUpdatersByTempId(@Param("templateId") String templateId);

    /**
     * 查询类型ID
     *
     * @param templateId 自定义模板ID
     * @return 类型ID
     * @author Chambers
     * @date 2020/5/25
     */
    String selectTypeIdByTempId(@Param("templateId") String templateId);

    /**
     * 修改模板的使用次数
     *
     * @param templateId 自定义模板ID
     * @param offset     偏移量
     * @return 修改数
     * @author Chambers
     * @date 2020/5/25
     */
    int updateUsedTimesByTempId(@Param("templateId") String templateId, @Param("offset") Integer offset);

    /**
     * 逻辑删除模板
     *
     * @param templateId 自定义模板ID
     * @return 修改数
     * @author Chambers
     * @date 2020/5/23
     */
    int updateIsDeletedByTempId(@Param("templateId") String templateId);

    /**
     * 查询模板dto
     *
     * @param typeId      类型ID
     * @param templateIds 模板ID列表（非必须）
     * @return 模板dto列表
     * @author Chambers
     * @date 2020/5/23
     */
    List<TemplateDto> selectDtoByTypeId(@Param("typeId") String typeId, @Param("list") List<String> templateIds);

    /**
     * 查询模板dto
     *
     * @param templateId 自定义模板ID
     * @return 模板dto
     * @author Chambers
     * @date 2020/5/25
     */
    @InterceptorIgnore(illegalSql = "true")
    TemplateDto selectDtoByTempId(@Param("templateId") String templateId);

    /**
     * 查询模板的基础信息
     *
     * @param templateId 自定义模板ID
     * @return 模板dto
     * @author Chambers
     * @date 2020/5/25
     */
    TemplateInfo selectInfoByTempId(@Param("templateId") String templateId);

    /**
     * 查询模板的基础信息
     *
     * @param id 表ID
     * @return 节点ID
     * @author Chambers
     * @date 2020/5/23
     */
    TemplateInfo selectInfoById(@Param("id") Long id);

    /**
     * 查询模板的基础信息
     *
     * @param typeId 类型ID
     * @return entity list
     * @author Chambers
     * @date 2020/6/23
     */
    List<TemplateInfo> selectInfoByTypeId(@Param("typeId") String typeId);

    /**
     * 修改信息
     *
     * @param id     表ID
     * @param entity 实体
     * @return 修改数
     * @author Chambers
     * @date 2020/6/24
     */
    int updateInfoById(@Param("entity") TemplateEntity entity, @Param("id") Long id);

    /**
     * 根据tempId和type获取节点ID
     *
     * @param tempId 模版ID
     * @param type   模版类型
     * @return 节点ID
     * @author zoe zheng
     * @date 2020/7/7 3:10 下午
     */
    String selectNodeIdByTempIdAndType(@Param("tempId") String tempId, @Param("type") Integer type);

    /**
     * 批量查询节点ID
     *
     * @param templateIds 模板ID列表
     * @return 节点ID
     * @author Chambers
     * @date 2020/9/4
     */
    List<String> selectNodeIdByTemplateIds(@Param("list") List<String> templateIds);

    /**
     * 模糊搜索模板
     *
     * @param templateIds 模板ID列表
     * @return result
     * @author Chambers
     * @date 2020/11/2
     */
    List<OnlineTemplateDto> selectByTemplateIds(@Param("list") Set<String> templateIds);
}
