package com.vikadata.api.component.audit;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.ReflectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.enums.datasheet.IdRulePrefixEnum;

import org.springframework.web.util.ContentCachingRequestWrapper;

import static com.vikadata.api.constants.CustomIdLengthConstant.ID_FIXED_LENGTH;
import static com.vikadata.api.constants.CustomIdLengthConstant.ID_PREFIX_LENGTH;

/**
 * <p>
 * 审计操作帮助类
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/4/23 14:17
 */
@Slf4j
public class AuditHelper {

    public static String fieldFill(Object obj, String action, AbstractAuditField auditField) {
        HashSet<String> extendFields = auditField.get(action);
        JSONObject jsonObject = JSONUtil.createObj();
        //获取父类的属性
        Field[] fields = ReflectUtil.getFields(obj.getClass());
        Set<String> fieldNames = Arrays.stream(fields).collect(Collectors.groupingBy(Field::getName)).keySet();
        for (String field : extendFields) {
            //field为下划线
            Object value = null;
            if (fieldNames.contains(StrUtil.toCamelCase(field))) {
                //继承存在值
                value = ReflectUtil.getFieldValue(obj, StrUtil.toCamelCase(field));
            }
            if (auditField.getFieldWrapperDict().containsKey(field)) {
                //反射代理方法调用
                String methodName = auditField.getFieldWrapperMethodName(field);
                String by = StrUtil.toCamelCase(field.substring(0, field.lastIndexOf("_")) + "_id");
                if (fieldNames.contains(by)) {
                    Field byField = ReflectUtil.getField(obj.getClass(), by);
                    value = fieldWrapper(obj, byField, methodName);
                }
            }
            jsonObject.set(field, value);
        }

        return JSONUtil.toJsonStr(jsonObject);
    }

    private static Object fieldWrapper(Object clz, Field parameter, String methodName) {
        IAuditFieldFactory auditFieldFactory = AuditFieldFactory.me();
        try {
            Method method = IAuditFieldFactory.class.getMethod(methodName, parameter.getType());
            return method.invoke(auditFieldFactory, parameter.get(clz));
        } catch (Exception e) {
            try {
                Method method = IAuditFieldFactory.class.getMethod(methodName, Long.class);
                return method.invoke(auditFieldFactory, Long.parseLong(parameter.toString()));
            } catch (Exception e1) {
                log.error("无法包装审计字段");
            }
        }
        return null;
    }

    public static Object resolveSpaceId(ParamLocation spaceParamLoc, ContentCachingRequestWrapper requestWrapper, Object responseData) {
        if (spaceParamLoc == ParamLocation.RESPONSE) {
            //从返回值获取
            JSONObject response = JSONUtil.parseObj(responseData);
            JSONObject data = response.getJSONObject("data");
            for (Object value : data.values()) {
                if (value != null && StrUtil.isNotBlank(value.toString()) && StrUtil.startWith(value.toString(), IdRulePrefixEnum.SPC.getIdRulePrefixEnum())) {
                    return value;
                }
            }
        }

        String paramName = "spaceId";

        if (spaceParamLoc == ParamLocation.HEADER) {
            return requestWrapper.getHeader(ParamsConstants.SPACE_ID);
        }

        if (spaceParamLoc == ParamLocation.PATH) {
            String uri = requestWrapper.getServletPath();
            String[] pathNames = StrUtil.split(uri, "/");
            for (String pathName : pathNames) {
                if (pathName.startsWith(IdRulePrefixEnum.SPC.getIdRulePrefixEnum()) && pathName.length() > ID_FIXED_LENGTH) {
                    return pathName;
                }
            }
        }

        if (spaceParamLoc == ParamLocation.QUERY) {
            return resolveFromQuery(requestWrapper, paramName);
        }

        if (spaceParamLoc == ParamLocation.BODY) {
            return resolveFromBody(requestWrapper, paramName);
        }

        return null;
    }

    public static Object resolveNodeId(ParamLocation nodeParamLoc, ContentCachingRequestWrapper requestWrapper, Object responseData) {
        String paramName = "nodeId";

        if (nodeParamLoc == ParamLocation.RESPONSE) {
            //从返回值获取
            JSONObject response = JSONUtil.parseObj(responseData);
            JSONObject data = response.getJSONObject("data");
            if (ObjectUtil.isNotNull(data)) {
                Object value = data.get(paramName);
                if (ObjectUtil.isNotNull(value) && StrUtil.isNotBlank(value.toString())) {
                    if (isNodeId(value.toString())) {
                        return value;
                    }
                }
            }
        }

        if (nodeParamLoc == ParamLocation.QUERY) {
            return resolveFromQuery(requestWrapper, paramName);
        }

        if (nodeParamLoc == ParamLocation.BODY) {
            return resolveFromBody(requestWrapper, paramName);
        }

        if (nodeParamLoc == ParamLocation.PATH) {
            String[] pathNames = StrUtil.split(requestWrapper.getServletPath(), "/");
            if (pathNames.length > 0) {
                String pathName = pathNames[pathNames.length - 1];
                if (isNodeId(pathName)) {
                    return pathName;
                }
            }
        }
        return null;
    }

    public static Object resolvePositionNodeId(ParamLocation nodeParamLoc, ContentCachingRequestWrapper requestWrapper, Object responseData, String paramName) {
        if (nodeParamLoc == ParamLocation.RESPONSE) {
            //从返回值获取
            JSONObject response = JSONUtil.parseObj(responseData);
            JSONObject data = response.getJSONObject("data");
            if (ObjectUtil.isNotNull(data)) {
                Object value = data.get(paramName);
                if (ObjectUtil.isNotNull(value) && StrUtil.isNotBlank(value.toString())) {
                    if (isNodeId(value.toString())) {
                        return value;
                    }
                }
            }
        }

        if (nodeParamLoc == ParamLocation.BODY) {
            return resolveFromBody(requestWrapper, paramName);
        }
        return null;
    }

    public static Object resolveFromQuery(ContentCachingRequestWrapper requestWrapper, String paramName) {
        return requestWrapper.getParameter(paramName);
    }

    public static Object resolveFromBody(ContentCachingRequestWrapper requestWrapper, String paramName) {
        String requestBody = new String(requestWrapper.getContentAsByteArray());
        if (StrUtil.isNotBlank(requestBody)) {
            JSONObject map = JSONUtil.parseObj(requestBody);
            if (map.containsKey(paramName)) {
                return map.get(paramName);
            }
        }

        return null;
    }

    public static boolean isNodeId(String id) {
        List<String> nodeIdPrefixes = Arrays.asList(IdRulePrefixEnum.FOD.getIdRulePrefixEnum(),
                IdRulePrefixEnum.DST.getIdRulePrefixEnum(), IdRulePrefixEnum.FORM.getIdRulePrefixEnum(),
                IdRulePrefixEnum.DASHBOARD.getIdRulePrefixEnum(), IdRulePrefixEnum.MIRROR.getIdRulePrefixEnum());
        return nodeIdPrefixes.contains(id.substring(0, ID_PREFIX_LENGTH));
    }
}
