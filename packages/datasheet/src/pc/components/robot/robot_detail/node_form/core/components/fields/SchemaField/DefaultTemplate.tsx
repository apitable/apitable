import { Label } from './Label';
import { WrapIfAdditional } from './WrapIfAdditional';

export function DefaultTemplate(props: any) {
  const {
    id,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    displayLabel,
  } = props;
  if (hidden) {
    return <div className="hidden">{children}</div>;
  }

  return (
    <WrapIfAdditional {...props}>
      {displayLabel && <Label label={label} required={required} id={id} />}
      {displayLabel && description ? description : null}
      {children}
      {errors}
      {help}
    </WrapIfAdditional>
  );
}

// if (process.env.NODE_ENV !== "production") {
//   DefaultTemplate.propTypes = {
//     id: PropTypes.string,
//     classNames: PropTypes.string,
//     label: PropTypes.string,
//     children: PropTypes.node.isRequired,
//     errors: PropTypes.element,
//     rawErrors: PropTypes.arrayOf(PropTypes.string),
//     help: PropTypes.element,
//     rawHelp: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
//     description: PropTypes.element,
//     rawDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
//     hidden: PropTypes.bool,
//     required: PropTypes.bool,
//     readonly: PropTypes.bool,
//     displayLabel: PropTypes.bool,
//     fields: PropTypes.object,
//     formContext: PropTypes.object,
//   };
// }

// DefaultTemplate.defaultProps = {
//   hidden: false,
//   readonly: false,
//   required: false,
//   displayLabel: true,
// };
