import { ObjectFieldTemplateProps, utils } from '@rjsf/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import { TitleField } from '../field';
import { getObjectDepth, getOptions } from '../utils';

const { canExpand } = utils;

const ObjectFieldTemplateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  .field-object {
    padding-top: 0!important;
  }
`;
const InlineObjectChildren = styled.div<{ inline?: boolean }>`
  display: ${(props) => props.inline ? 'flex' : 'block'};  
  align-items: flex-start;
`;

const ObjectFieldLayout = (props: ObjectFieldTemplateProps) => {
  const { properties, uiSchema } = props;
  const isInline = Boolean(uiSchema['ui:options']?.inline);
  const layout = uiSchema['ui:options']?.layout;
  if (layout) {
    return (
      <>
        {
          (layout as string[][]).map(rowFieldNames => {
            const thisRowFields = properties.filter(ele => rowFieldNames.includes(ele.name));
            if (thisRowFields.length) {
              const width = isInline ? `${Math.round(100 / thisRowFields.length)}%` : '100%';
              return <InlineObjectChildren inline={isInline}>
                {thisRowFields.map((element, index: number) => (
                  <div
                    key={index} // FIXME: better key
                    style={{ marginRight: '4px', width }}
                  >
                    {element.content}
                  </div>
                ))}
              </InlineObjectChildren>;
            }
            return null;
          })
        }
      </>
    );
  }

  const width = isInline ? `${Math.round(100 / properties.length)}%` : '100%';
  return (
    <InlineObjectChildren inline={isInline}>
      {properties.map((element: any, index: number) => (
        <div
          key={index} // FIXME: better key
          style={{ marginRight: '4px', width }}
        >
          {element.content}
        </div>
      ))}
    </InlineObjectChildren>
  );
};

export const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  const {
    title,
    required,
    disabled,
    readonly,
    uiSchema,
    idSchema,
    schema,
    formData,
    onAddClick,
  } = props;

  const hasCollapse = 'ui:options' in uiSchema && 'collapse' in uiSchema['ui:options']!;
  const showTitle = 'ui:options' in uiSchema && 'showTitle' in uiSchema['ui:options']! ? Boolean(uiSchema['ui:options']!['showTitle']) : true;
  const help = getOptions('help', uiSchema).value;
  const defaultCollapse = Boolean(uiSchema['ui:options']?.collapse);
  const [collapse, setCollapse] = useState<boolean>(defaultCollapse);
  const currentObjectDepth = getObjectDepth(props);
  // const isInline = Boolean(uiSchema['ui:options']?.inline);
  // if (currentObjectDepth > 3) return null;
  return (
    <ObjectFieldTemplateWrapper>
      {(uiSchema['ui:title'] || title) && (
        showTitle && <TitleField
          id={`${idSchema.$id}-${currentObjectDepth}`}
          title={title}
          required={required}
          help={help}
          hasCollapse={hasCollapse}
          onChange={setCollapse}
          defaultCollapse={defaultCollapse}
        />
      )}
      {/* {description && (
        <DescriptionField
          id={`${idSchema.$id}-description`}
          description={description}
        />
      )} */}
      {
        !collapse && <div>
          <ObjectFieldLayout {...props} />
          {/* <InlineObjectChildren inline={isInline}>
            {properties.map((element: any, index: number) => (
              <div
                style={{ marginBottom: '10px', marginRight: '4px', width: '100%' }}
              >
                {element.content}
              </div>
            ))}
          </InlineObjectChildren> */}
          {canExpand(schema, uiSchema, formData) && (

            <button
              onClick={onAddClick(schema)}
              disabled={disabled || readonly}
            />
          )}
        </div>
      }

    </ObjectFieldTemplateWrapper>
  );
};

export default ObjectFieldTemplate;