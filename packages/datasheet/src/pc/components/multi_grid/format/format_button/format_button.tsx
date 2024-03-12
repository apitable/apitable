import type { InputRef } from 'antd';
import { Input, message } from 'antd';
import produce from 'immer';
import { useSetAtom } from 'jotai';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { useRef, Dispatch, SetStateAction, useMemo, useState, useCallback, MutableRefObject } from 'react';
import styled from 'styled-components';
import { Box, DropdownSelect, FloatUiTooltip, LinkButton, Typography } from '@apitable/components';
import {
  IButtonField,
  ButtonStyleType,
  ButtonActionType,
  Strings,
  t,
  expressionTransform,
  Selectors,
  IButtonProperty,
  OpenLinkType,
  BasicValueType,
  parse,
  IReduxState,
  ConfigConstant,
  IField,
} from '@apitable/core';
import { AddOutlined, SyncOnOutlined } from '@apitable/icons';
import { automationApiClient, workbenchClient } from 'pc/common/api-client';
import { AutomationConstant, CONST_MAX_TRIGGER_COUNT } from 'pc/components/automation/config';
import { automationSourceAtom } from 'pc/components/automation/controller'; // trace
import { IOnChangeParams } from 'pc/components/data_source_selector/interface';
import { DataSourceSelectorForNode } from 'pc/components/data_source_selector_enhanced/data_source_selector_for_node/data_source_selector_for_node';
import { AutomationItem } from 'pc/components/multi_grid/format/format_button/automation_item';
import { ButtonTitle } from 'pc/components/multi_grid/format/format_button/ButtonTitle';
import { createTrigger } from 'pc/components/robot/api';
import { useCssColors } from 'pc/components/robot/robot_detail/trigger/use_css_colors';
import { useTriggerTypes } from 'pc/components/robot/robot_panel/hook_trigger';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { ButtonOperateType } from 'pc/utils';
import settingStyles from '../../field_setting/styles.module.less';
import { openFormulaModal } from '../format_formula/open_formula_modal';
import { assignDefaultFormatting } from '../format_lookup';
import { ColorPicker } from './color_picker';
import styles from './styles.module.less';

const Option = DropdownSelect.Option;

interface IFormateButtonProps {
  currentField: IButtonField;
  setCurrentField: Dispatch<SetStateAction<IButtonField>>;
  onUpdate: (field: IField) => void;
  onCreate?: (field: IField) => void;
  datasheetId?: string;
}

const StyledIntput = styled(Input)`
  .ant-input:focus {
    border-right-style: none;
  }
  .ant-input:hover {
    border-right-style: none;
  }

  .ant-input {
    border-right-style: none;
  }

  .ant-input:hover + * {
    border-style: solid;
    border-left-style: none;
    border-width: 1px;
    border-color: var(--primaryColor) !important;
  }
  .ant-input:focus + * {
    border-style: solid;
    border-left-style: none;
    border-width: 1px;
    border-color: var(--primaryColor) !important;
  }
`;

export const FormatButton: React.FC<React.PropsWithChildren<IFormateButtonProps>> = (props) => {
  const { currentField, setCurrentField, onUpdate, onCreate, datasheetId: propDatasheetId } = props;
  const { text, style, action } = currentField.property;

  const [bingAutomationVisible, setBingAutomationVisible] = useState(false);

  const datasheetId = useAppSelector((state: IReduxState) => propDatasheetId || Selectors.getActiveDatasheetId(state))!;

  const activeFieldState = useAppSelector((state) => Selectors.gridViewActiveFieldState(state, datasheetId));
  const handleModify = useCallback(
    (field: IField) => {
      if (activeFieldState.fieldId === ButtonOperateType.AddField) {
        onCreate?.(field);
      } else {
        onUpdate(field);
      }
    },
    [activeFieldState.fieldId, onCreate, onUpdate],
  );
  const rootId = useAppSelector((r) => r.catalogTree.rootId);

  const datasheetParentId = useAppSelector((state) => Selectors.getDatasheet(state, propDatasheetId)!.parentId);

  const fieldMap = useAppSelector((state: IReduxState) => Selectors.getFieldMap(state, datasheetId || state.pageParams.datasheetId!))!;
  const fieldPermissionMap = useAppSelector((state: IReduxState) => Selectors.getFieldPermissionMap(state, datasheetId));

  const textInputRef = useRef<InputRef>(null);
  const urlInputRef = useRef<InputRef>(null);
  const inputformulaRef = useRef<InputRef>(null);

  const transformedExp = useMemo(() => {
    const openLink = action?.openLink;
    if (!openLink) return;
    try {
      return expressionTransform(openLink.expression, { fieldMap, fieldPermissionMap }, 'name');
    } catch (e) {
      return openLink.expression;
    }
  }, [action, fieldMap, fieldPermissionMap]);

  const setFieldProperty = (key: string) => (value: any) => {
    const updataProperty = (newProperty: Partial<IButtonProperty> = {}) => {
      const newItem = {
        ...currentField,
        // @ts-ignore
        property: {
          ...newProperty,
        },
      };
      // @ts-ignore
      setCurrentField(newItem);
    };
    updataProperty({
      ...currentField.property,
      [key]: value,
    });
  };

  const getExpValueType = (exp: string) => {
    const fExp = parse(exp, { field: currentField, fieldMap, state: store.getState() });
    if ('error' in fExp) {
      return BasicValueType.String;
    }

    if (fExp && fExp.ast.valueType) {
      if (fExp.ast.valueType === BasicValueType.Array) {
        return fExp.ast.innerValueType || BasicValueType.String;
      }
      return fExp.ast.valueType;
    }
    return BasicValueType.String;
  };

  const handleChange = (value: string) => {
    const showFormatType = getExpValueType(value);

    const data = assignDefaultFormatting(showFormatType, {
      ...currentField,
      property: {
        ...currentField.property,
        datasheetId,
        action: {
          ...currentField.property.action,
          openLink: {
            ...currentField.property.action.openLink,
            type: currentField.property.action.openLink?.type! as OpenLinkType,
            expression: value,
          },
        },
      },
    });
    setCurrentField(data as IButtonField);
    inputformulaRef.current && inputformulaRef.current.focus();
  };

  const router = useRouter();
  const colors = useCssColors();

  const { data: triggerTypes } = useTriggerTypes();
  const buttonFieldTriggerId = triggerTypes.find((item) => item.endpoint === 'button_field' || item.endpoint === 'button_clicked');

  const handleAddTrigger = useCallback(
    async (resourceId: string, datasheetId: string, fieldId: string, onUpdate: (resp: string) => void) => {
      const item = await automationApiClient.getResourceRobots({
        resourceId,
        shareId: '',
      });
      const data = item?.data?.[0];
      const triggerLength = data?.triggers?.length ?? 0;
      const triggerRes = await createTrigger(resourceId, {
        prevTriggerId: triggerLength > 0 ? data?.triggers?.[triggerLength - 1]?.triggerId : undefined,
        robotId: data?.robotId,
        triggerTypeId: buttonFieldTriggerId?.triggerTypeId!,
        relatedResourceId: datasheetId,
        input: {
          type: 'Expression',
          value: {
            operator: 'newObject',
            operands: [
              'datasheetId',
              {
                type: 'Literal',
                value: datasheetId,
              },
              'fieldId',
              {
                type: 'Literal',
                value: fieldId,
              },
            ],
          },
        },
      });
      if (triggerRes?.data?.data?.[0]?.triggerId) {
        onUpdate(triggerRes.data.data[0].triggerId);
      }
    },
    [buttonFieldTriggerId?.triggerTypeId],
  );

  const setAutomationSource = useSetAtom(automationSourceAtom);

  const handleClick=useCallback(async () => {
    const r = await workbenchClient.create3({
      nodeOpRo: {
        preNodeId: datasheetId,
        parentId: datasheetParentId,
        type: 10,
      },
    });
    if(!r.success) {
      message.error(r.message);
    }
    const automationId = r?.data?.nodeId;

    if (!automationId) {
      return;
    }

    await handleAddTrigger(automationId, datasheetId, currentField.id, (triggerId) => {
      const item = produce(currentField, (draft) => {
        draft.property.action.type = ButtonActionType.TriggerAutomation;
        if (automationId) {
          if (draft.property.action?.automation) {
            draft.property.action.automation.automationId = automationId;
            draft.property.action.automation.triggerId = triggerId;
          } else {
            draft.property.action.automation = { automationId, triggerId };
          }
        }
      });

      setBingAutomationVisible(false);
      setAutomationSource('datasheet');

      handleModify(item);

      setTimeout(() => {
        router.push(`/workbench/${automationId}`);
      }, 50);
    });
  }, [currentField, datasheetId, datasheetParentId, handleAddTrigger, handleModify, router, setAutomationSource]);

  const handleClickDebounce = debounce(handleClick, 300);
  const handleAutomationChange = useCallback(async ({ automationId }: IOnChangeParams) => {
    if (!automationId) {
      return;
    }
    const robot = await automationApiClient.getResourceRobots({
      resourceId: automationId,
      shareId: '',
    });

    const data = robot.data?.[0]?.triggers?.length;

    if (data && data >= CONST_MAX_TRIGGER_COUNT) {
      message.warn(t(Strings.number_of_trigger_is_full));
      return;
    }

    await handleAddTrigger(automationId, datasheetId, currentField.id, (triggerId) => {
      const item = produce(currentField, (draft) => {
        draft.property.action.type = ButtonActionType.TriggerAutomation;
        if (automationId) {
          if (draft.property.action?.automation) {
            draft.property.action.automation.automationId = automationId;
            draft.property.action.automation.triggerId = triggerId;
          } else {
            draft.property.action.automation = { automationId, triggerId };
          }
        }
      });

      setBingAutomationVisible(false);
      setCurrentField(item);
    });
  }, [currentField, datasheetId, handleAddTrigger, setCurrentField]);

  const loadingNewRef: MutableRefObject<boolean> = useRef(false);
  const loadingCreateRef: MutableRefObject<boolean> = useRef(false);
  const handleAutomationChangeDebounced = debounce(handleAutomationChange, 300);
  return (
    <>
      {bingAutomationVisible && (
        <DataSourceSelectorForNode
          footer={
            <>
              <Box
                paddingLeft={'16px'}
                onClick={async () => {
                  try {
                    if(loadingNewRef.current) {
                      return;
                    }
                    loadingNewRef.current =true;
                    await handleClickDebounce();
                  } finally {
                    loadingNewRef.current =false;
                  }
                }
                }
              >
                <LinkButton prefixIcon={<AddOutlined color={colors.textBrandDefault} />} underline={false}>
                  <Typography variant={'body4'} color={colors.textBrandDefault}>
                    {t(Strings.add_automation_node)}
                  </Typography>
                </LinkButton>
              </Box>
            </>
          }
          onHide={() => {
            if (!action?.automation?.automationId) {
              setFieldProperty('action')({
                ...action,
                type: undefined,
              });
            }
            setBingAutomationVisible(false);
          }}
          permissionRequired={'editable'}
          onChange={async (e) => {
            try {
              if(loadingCreateRef.current) {
                return;
              }
              loadingCreateRef.current=true;
              await handleAutomationChangeDebounced(e);
            } finally {
              loadingCreateRef.current=false;
            }
          }}
          nodeTypes={[ConfigConstant.NodeType.AUTOMATION, ConfigConstant.NodeType.FOLDER]}
          defaultNodeIds={{ folderId: rootId, automationId: action?.automation?.automationId }}
          requiredData={['automationId']}
        />
      )}

      <section className={settingStyles.section}>
        <div className={settingStyles.sectionTitle}>{t(Strings.button_text)}</div>
        <ButtonTitle
          ref={textInputRef}
          value={text}
          onChange={(e) => {
            setFieldProperty('text')(e);
          }}
        />
      </section>
      <section className={settingStyles.section}>
        <div className={settingStyles.sectionTitle}>{t(Strings.button_style)}</div>
        <DropdownSelect
          value={style.type || ButtonStyleType.Background}
          onSelected={({ value }) => {
            const newItem = {
              ...currentField,
              // @ts-ignore
              property: {
                ...currentField.property,
                style: {
                  ...currentField.property.style,
                  type: value as unknown as ButtonStyleType,
                },
              },
            };
            setCurrentField(newItem);
          }}
        >
          <Option value={ButtonStyleType.Background} key={ButtonStyleType.Background} currentIndex={0}>
            {t(Strings.colored_button)}
          </Option>
          <Option value={ButtonStyleType.OnlyText} key={ButtonStyleType.OnlyText} currentIndex={1}>
            {t(Strings.text_button)}
          </Option>
        </DropdownSelect>
      </section>
      <section className={settingStyles.section}>
        <div className={settingStyles.sectionTitle}>{t(Strings.button_color)}</div>
        <ColorPicker
          options={{
            content: text,
            style: style.type,
          }}
          color={style.color || AutomationConstant.defaultColor}
          onchange={(value: number) => {
            setFieldProperty('style')({
              ...style,
              color: value,
            });
          }}
        />
      </section>

      <section className={settingStyles.section}>
        <div className={settingStyles.sectionTitle}>{t(Strings.button_operation)}</div>
        <DropdownSelect
          searchPlaceholder={t(Strings.please_select)}
          placeholder={t(Strings.please_select)}
          value={action.type}
          onSelected={({ value }) => {
            if (value === ButtonActionType.OpenLink) {
              const item = produce(currentField, (draft) => {
                draft.property.action = {
                  ...action,
                  openLink: {
                    type: OpenLinkType.Url,
                    expression: '',
                  },
                  type: value,
                };
              });
              setCurrentField(item);
              setTimeout(() => {
                urlInputRef.current?.focus();
              }, 20);
            }
            if (value === ButtonActionType.TriggerAutomation) {
              setBingAutomationVisible(true);
            }
          }}
        >
          <Option value={ButtonActionType.OpenLink} key={ButtonActionType.OpenLink} currentIndex={0}>
            {t(Strings.open_url)}
          </Option>
          <Option value={ButtonActionType.TriggerAutomation} key={ButtonActionType.TriggerAutomation} currentIndex={1}>
            {t(Strings.start_automation_workflow)}
          </Option>
        </DropdownSelect>
      </section>

      {action.type === ButtonActionType.OpenLink && (
        <section className={settingStyles.section}>
          <div className={settingStyles.sectionTitle}>URL</div>
          <div className={styles.openLinkInput}>
            {action?.openLink?.type === OpenLinkType.Url ? (
              <StyledIntput
                ref={urlInputRef}
                value={action.openLink.expression}
                placeholder={t(Strings.open_url_tips_string)}
                onChange={(e) => {
                  setFieldProperty('action')({
                    ...action,
                    openLink: {
                      ...action.openLink,
                      expression: e.target.value,
                    },
                  });
                }}
                addonAfter={
                  <div
                    className={styles.switchUrl}
                    onClick={() => {
                      setFieldProperty('action')({
                        ...action,
                        openLink: {
                          ...action.openLink,
                          expression: '',
                          type: OpenLinkType.Expression,
                        },
                      });
                    }}
                  >
                    <div className={styles.divider} />
                    <FloatUiTooltip
                      content={t(Strings.open_url_tips_switch, {
                        INPUT_MODE: t(Strings.field_title_formula),
                      })}
                    >
                      <span>
                        <SyncOnOutlined
                          color={colors.textCommonTertiary}
                          size={16}
                          onClick={() => {
                            setFieldProperty('action')({
                              ...action,
                              openLink: {
                                ...action.openLink,
                                expression: '',
                                type: OpenLinkType.Expression,
                              },
                            });
                          }}
                        />
                      </span>
                    </FloatUiTooltip>
                  </div>
                }
              />
            ) : (
              <StyledIntput
                ref={inputformulaRef}
                className="code"
                placeholder={t(Strings.input_formula)}
                value={transformedExp}
                onClick={() => {
                  openFormulaModal({
                    field: currentField,
                    expression: action.openLink?.expression ?? '',
                    onSave: handleChange,
                    datasheetId,
                  });
                }}
                addonAfter={
                  <div
                    className={styles.switchUrl}
                    onClick={() => {
                      setFieldProperty('action')({
                        ...action,
                        openLink: {
                          ...action.openLink,
                          expression: '',
                          type: OpenLinkType.Url,
                        },
                      });
                    }}
                  >
                    <div className={styles.divider} />
                    <FloatUiTooltip
                      content={t(Strings.open_url_tips_switch, {
                        INPUT_MODE: 'URL',
                      })}
                    >
                      <span>
                        <SyncOnOutlined
                          color={colors.textCommonTertiary}
                          size={16}
                          onClick={() => {
                            setFieldProperty('action')({
                              ...action,
                              openLink: {
                                ...action.openLink,
                                expression: '',
                                type: OpenLinkType.Url,
                              },
                            });
                          }}
                        />
                      </span>
                    </FloatUiTooltip>
                  </div>
                }
              />
            )}
          </div>
        </section>
      )}

      {action.type === ButtonActionType.TriggerAutomation && (
        <>
          {action?.automation?.automationId && (
            <AutomationItem
              id={action?.automation?.automationId}
              fieldId={currentField.id}
              handleDelete={() => {
                const item = produce(currentField, (draft) => {
                  draft.property.action.type = undefined;
                  if (draft.property.action?.automation) {
                    // @ts-ignore
                    draft.property.action.automation = undefined;
                  }
                });
                setCurrentField(item);
              }}
            />
          )}
        </>
      )}
    </>
  );
};
