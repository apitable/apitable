// Define a React component renderer for our code blocks.
import { getExpressionChainList, IExpressionChainNode } from './helper';
import { IJsonSchema, INodeOutputSchema } from '../../interface';
import { Box, useTheme, Typography } from '@vikadata/components';
import { FormOutlined } from '@vikadata/icons';
import { Strings, t } from '@apitable/core';

export const MagicVariableElement = props => {
  const { element, children } = props;
  const theme = useTheme();
  const nodeOutputSchemaList = props.nodeOutputSchemaList as INodeOutputSchema[];
  const chainList = getExpressionChainList(element.data).reverse();
  // console.log('MagicVariableElement');

  const nodeSchemaIndex = nodeOutputSchemaList.findIndex(item => item.id === chainList[0].value);
  const nodeSchema = nodeOutputSchemaList[nodeSchemaIndex];
  const nodeList: { type: 'function' | 'property', title: string }[] = [{
    type: 'property',
    title: t(Strings.robot_inserted_variable_part_1, {
      number: nodeSchemaIndex + 1
    }),
  }];
  let schema = nodeSchema?.schema;
  let hasError = false;
  const getSchemaPropertyTitle = (chainNode: IExpressionChainNode) => {
    if (chainNode.type === 'function') {
      nodeList.push({
        type: 'function',
        title: chainNode.name,
      });
      return;
    }
    // 
    if (!schema) return;
    switch (schema.type) {
      case 'object':
        schema = schema.properties![chainNode.value];
        if (!schema) {
          hasError = true;
          nodeList.push({
            type: 'property',
            title: t(Strings.robot_inserted_variable_invalid),
          });
          return;
        }
        nodeList.push({
          type: 'property',
          title: schema.title!,
        });
        break;
      case 'array':
        schema = (schema.items! as IJsonSchema);
        if (['number', 'string', 'boolean'].includes(schema!.type as string)) {
          nodeList.push({
            type: 'property',
            title: schema.title!,
          });
        } else {
          getSchemaPropertyTitle(chainNode);
        }
        break;
      case 'string':
      case 'number':
      case 'boolean':
        nodeList.push({
          type: 'property',
          title: schema.title!,
        });
        break;
    }
  };
  chainList.slice(1).forEach(property => {
    getSchemaPropertyTitle(property);
  });
  return (
    <Box
      contentEditable="false"
      display="inline-flex"
      margin="0 2px"
      verticalAlign='middle'
    // border='1px solid transparent'
    >
      {
        nodeList.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === nodeList.length - 1;
          const getBorderRadiusStyle = () => {
            if (isFirst) {
              return '2px 0px 0px 2px';
            }
            if (isLast) {
              return '0px 2px 2px 0px';
            }
            return '0';
          };

          const getBorderStyle = () => {
            const borderStyle: any = {
              borderTop: `1px solid ${theme.color.black[200]}`,
              borderBottom: `1px solid ${theme.color.black[200]}`,
            };

            if (isFirst) {
              borderStyle.borderLeft = `1px solid ${theme.color.black[200]}`;
            }
            if (isLast) {
              borderStyle.borderRight = `1px solid ${theme.color.black[200]}`;
            } else {
              borderStyle.boxShadow = `inset -1px 0px 0px ${theme.color.deepPurple[100]}`;
            }
            return borderStyle;
          };
          return (
            <Box
              key={index}
              display="inline-flex"
              alignItems="center"
              backgroundColor={hasError ? theme.color.red[50] : theme.color.deepPurple[50]}
              height="24px"
              borderRadius={getBorderRadiusStyle()}
              padding="2px 4px"
              // boxShadow={`inset -1px 0px 0px ${theme.color.indigo[200]}`}
              {...getBorderStyle()}
            >
              {isFirst && <FormOutlined color={hasError ? theme.color.red[500] : theme.color.deepPurple[500]} />}
              <Typography key={index} variant="body3" color={hasError ? theme.color.red[500] : theme.color.deepPurple[500]}>
                {item.title}
              </Typography>
            </Box>
          );
        })
      }
      {children}
    </Box>
  );
};
