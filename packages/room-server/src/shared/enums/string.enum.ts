// TODO(remove eslint disable)
/* eslint-disable @typescript-eslint/naming-convention */
/**
 * <p>
 * fusionApi用到的错误提示ID，对应维格表api.tips的ID字段的值
 * </p>
 * @author Zoe zheng
 * @date 2020/10/16 11:37 上午
 */
export enum ApiTipIdEnum {
  apiParamDefaultError = 'api_param_default_error',
  apiParamsEmptyError = 'api_params_empty_error',
  apiParamsInvalidValue = 'api_params_invalid_value',
  apiParamsMinError = 'api_params_min_error',
  apiParamsMaxError = 'api_params_max_error',
  apiParamsMaxLengthError = 'api_params_max_length_error',
  apiParamsMaxCountError = 'api_params_max_count_error',
  apiParamsInstanceError = 'api_params_instance_error',
  apiParamsNotExists = 'api_params_not_exists',
  apiParamFormulaError = 'api_param_formula_error',
  apiParamsCanNotOperate = 'api_params_can_not_operate',
  apiQueryParamsViewIdNotExists = 'api_query_params_view_id_not_exists',
  // type
  apiParamTypeError = 'api_param_type_error',
  apiParamsMustUnique = 'api_params_must_unique',
  apiParamsInvalidPrimaryFieldTypeError = 'api_params_invalid_primary_field_type_error',
  // permission
  apiNodePermissionError = 'api_node_permission_error',
  // datasheet
  apiDatasheetNotExist = 'api_datasheet_not_exist',
  // 限流
  apiFrequentlyError = 'api_frequently_error',
  // 全局
  apiDeleteError = 'api_delete_error',
  apiInsertError = 'api_insert_error',
  apiUpdateError = 'api_update_error',
  apiForbidden = 'api_forbidden',
  apiUnauthorized = 'api_unauthorized',
  apiServerError = 'api_server_error',
  apiNotExists = 'api_not_exists',
  apiGetFieldsError = 'api_get_fields_error',
  apiGetViewsError = 'api_get_views_error',
  // 附件
  apiUploadAttachmentError = 'api_upload_attachment_error',
  apiUploadAttachmentExceedLimit = 'api_upload_attachment_exceed_limit',
  apiSpaceCapacityOverLimit = 'api_space_capacity_over_limit',
  apiParamsPrimaryFieldNotAllowedToDelete = 'api_params_primary_field_not_allowed_to_delete',
}
