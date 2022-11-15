import SuccessIcon from 'static/icon/common/common_icon_success.svg';
import InfoIcon from 'static/icon/common/common_icon_default.svg';
import { colorVars } from '@apitable/components';
import { WarnFilled, ErrorFilled } from '@apitable/icons';
// const modulesFiles = require.context('./modules', true, /.js$/)

enum StatusType {
  Info = 'info',
  Primary = 'primary',
  Success = 'success',
  Error = 'error',
  Danger = 'danger',
  Warning = 'warning',
}

interface IStatusIconFuncProps {
  type: string,
  fillColor?: string;
  width?: number;
  height?: number;
}
export const StatusIconFunc = (props: IStatusIconFuncProps) => {
  const { type, fillColor, width = 24, height = 24 } = props;
  switch (type) {
    case StatusType.Info:
      return <InfoIcon width={width} height={height} fill={fillColor || colorVars.primaryColor} />;
    case StatusType.Primary:
      return <InfoIcon width={width} height={height} fill={fillColor || colorVars.primaryColor} />;
    case StatusType.Success:
      return <SuccessIcon width={width} height={height} fill={fillColor || colorVars.successColor } />;
    case StatusType.Error:
      return ErrorFilled({ size: width });
    case StatusType.Danger:
      return ErrorFilled({ size: width });
    case StatusType.Warning:
      return WarnFilled({ size: width });
    default:
      return null;
  }
};
