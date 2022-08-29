import * as React from 'react';

interface IHelpProps {
  id: string;
  help: string | React.ReactElement;
}

export function Help(props: IHelpProps) {
  const { id, help } = props;
  if (!help) {
    return null;
  }
  if (typeof help === 'string') {
    return (
      <p id={id} className="help-block">
        {help}
      </p>
    );
  }
  return (
    <div id={id} className="help-block">
      {help}
    </div>
  );
}