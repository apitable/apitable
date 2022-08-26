export interface APITipConfigInterface {
    api: API;
}

export interface API {
    tips: Tips;
}

export interface Tips {
    api_request_success:                                  PuneHedgehog;
    api_datasheet_not_exist:                              PuneHedgehog;
    api_upload_attachment_error:                          PuneHedgehog;
    api_upload_attachment_exceed_limit:                   PuneHedgehog;
    api_node_permission_error:                            PuneHedgehog;
    api_unauthorized:                                     PuneHedgehog;
    api_forbidden:                                        PuneHedgehog;
    api_forbidden_because_of_usage:                       PuneHedgehog;
    api_not_exists:                                       PuneHedgehog;
    api_frequently_error:                                 PuneHedgehog;
    api_server_error:                                     PuneHedgehog;
    api_params_can_not_operate:                           PuneHedgehog;
    api_params_invalid_value:                             PuneHedgehog;
    api_params_min_error:                                 PuneHedgehog;
    api_params_max_error:                                 PuneHedgehog;
    api_params_empty_error:                               PuneHedgehog;
    api_params_max_count_error:                           PuneHedgehog;
    api_params_instance_error:                            PuneHedgehog;
    api_delete_error:                                     PuneHedgehog;
    api_insert_error:                                     PuneHedgehog;
    api_update_error:                                     PuneHedgehog;
    api_param_formula_error:                              PuneHedgehog;
    api_param_type_error:                                 PuneHedgehog;
    api_param_default_error:                              PuneHedgehog;
    api_space_capacity_over_limit:                        PuneHedgehog;
    api_query_params_view_id_not_exists:                  PuneHedgehog;
    api_params_not_exists:                                PuneHedgehog;
    api_params_must_unique:                               PuneHedgehog;
    api_forbidden_because_of_not_in_space:                PuneHedgehog;
    api_params_instance_space_id_error:                   PuneHedgehog;
    api_param_invalid_space_id_value:                     PuneHedgehog;
    api_param_sort_field_not_exists:                      PuneHedgehog;
    api_params_record_ids_must_unique:                    PuneHedgehog;
    api_datasheet_not_visible:                            PuneHedgehog;
    api_upload_attachment_oversize:                       PuneHedgehog;
    api_upload_attachment_exceed_capacity_limit:          PuneHedgehog;
    api_upload_attachment_not_editable:                   PuneHedgehog;
    api_param_view_not_exists:                            PuneHedgehog;
    api_param_record_not_exists:                          PuneHedgehog;
    api_param_attachment_not_exists:                      PuneHedgehog;
    api_param_unit_not_exists:                            PuneHedgehog;
    api_param_unit_name_type_not_exists:                  PuneHedgehog;
    api_params_automumber_can_not_operate:                PuneHedgehog;
    api_params_createdby_can_not_operate:                 PuneHedgehog;
    api_params_created_time_can_not_operate:              PuneHedgehog;
    api_params_formula_can_not_operate:                   PuneHedgehog;
    api_params_updatedby_can_not_operate:                 PuneHedgehog;
    api_params_updated_time_can_not_operate:              PuneHedgehog;
    api_params_lookup_can_not_operate:                    PuneHedgehog;
    api_params_invalid_fields_value:                      PuneHedgehog;
    api_params_invalid_field_type:                        PuneHedgehog;
    api_query_params_invalid_fields:                      PuneHedgehog;
    api_params_invalid_field_key:                         PuneHedgehog;
    api_params_invalid_order_sort:                        PuneHedgehog;
    api_upload_invalid_file:                              PuneHedgehog;
    api_upload_invalid_file_name:                         PuneHedgehog;
    api_param_invalid_rating_field:                       PuneHedgehog;
    api_params_max_length_error:                          PuneHedgehog;
    api_params_link_field_record_ids_must_unique:         PuneHedgehog;
    api_params_multiselect_field_record_ids_must_unique:  PuneHedgehog;
    api_params_pagesize_min_error:                        PuneHedgehog;
    api_params_maxrecords_min_error:                      APIParamsMaxrecordsMinError;
    api_params_pagenum_min_error:                         PuneHedgehog;
    api_params_pagesize_max_error:                        PuneHedgehog;
    api_params_rating_field_max_error:                    PuneHedgehog;
    api_params_records_empty_error:                       PuneHedgehog;
    api_params_recordids_empty_error:                     PuneHedgehog;
    api_params_link_field_recordids_empty_error:          PuneHedgehog;
    api_params_records_max_count_error:                   PuneHedgehog;
    api_params_link_field_records_max_count_error:        PuneHedgehog;
    api_params_member_field_records_max_count_error:      PuneHedgehog;
    api_params_invalid_primary_field_type_error:          PuneHedgehog;
    api_params_instance_fields_error:                     PuneHedgehog;
    api_params_instance_recordid_error:                   PuneHedgehog;
    api_params_instance_sort_error:                       PuneHedgehog;
    api_params_instance_attachment_name_error:            PuneHedgehog;
    api_params_instance_attachment_token_error:           PuneHedgehog;
    api_params_instance_member_name_error:                PuneHedgehog;
    api_params_instance_member_type_error:                PuneHedgehog;
    api_delete_error_foreign_datasheet_deleted:           PuneHedgehog;
    api_add_row_failed_wrong_length_of_value:             PuneHedgehog;
    api_param_formula_function_content_empty:             PuneHedgehog;
    api_param_formula_function_err_no_left_bracket:       PuneHedgehog;
    api_param_formula_function_err_end_of_right_bracket:  PuneHedgehog;
    api_param_formula_function_err_unable_parse_char:     PuneHedgehog;
    api_param_formula_function_err_wrong_function_suffix: PuneHedgehog;
    api_param_formula_function_err_no_ref_self_column:    PuneHedgehog;
    api_param_formula_function_err_not_definition:        PuneHedgehog;
    api_param_formula_function_err_unknown_operator:      PuneHedgehog;
    api_param_attachment_token_type_error:                PuneHedgehog;
    api_param_attachment_name_type_error:                 PuneHedgehog;
    api_param_attachment_array_type_error:                PuneHedgehog;
    api_param_currency_field_type_error:                  PuneHedgehog;
    api_param_number_field_type_error:                    PuneHedgehog;
    api_param_percent_field_type_error:                   PuneHedgehog;
    api_param_rating_field_type_error:                    PuneHedgehog;
    api_param_email_field_type_error:                     PuneHedgehog;
    api_param_phone_field_type_error:                     PuneHedgehog;
    api_param_singletext_field_type_error:                PuneHedgehog;
    api_param_text_field_type_error:                      PuneHedgehog;
    api_param_url_field_type_error:                       PuneHedgehog;
    api_param_checkbox_field_type_error:                  PuneHedgehog;
    api_param_datetime_field_type_error:                  PuneHedgehog;
    api_param_link_field_type_error:                      PuneHedgehog;
    api_param_member_field_type_error:                    PuneHedgehog;
    api_param_member_id_type_error:                       PuneHedgehog;
    api_params_tree_select_can_not_operate:               PuneHedgehog;
    api_param_multiselect_field_type_error:               PuneHedgehog;
    api_param_multiselect_field_value_type_error:         PuneHedgehog;
    api_param_select_field_value_type_error:              PuneHedgehog;
    api_param_invalid_record_id_value:                    PuneHedgehog;
    api_params_link_field_recordids_not_exists:           PuneHedgehog;
    api_params_cellformat_error:                          PuneHedgehog;
    api_params_primary_field_not_allowed_to_delete:       PuneHedgehog;
}

export interface PuneHedgehog {
    code:           number;
    id:             string;
    isRecordTimes?: boolean;
    message?:       string;
    statusCode:     number;
    apiTypes?:      APITypes;
}

export enum APITypes {
    FusionAPI = "fusion_api",
}

export interface APIParamsMaxrecordsMinError {
    code:       number;
    id:         string;
    statusCode: number;
}
