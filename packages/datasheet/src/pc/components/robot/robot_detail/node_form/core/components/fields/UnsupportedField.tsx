import { JSONSchema7 } from 'json-schema';
import { IdSchema } from '../../interface';

interface IUnexpectedFieldProps {
  schema: JSONSchema7;
  idSchema: IdSchema;
  reason: string;
}

function UnsupportedField({ schema, idSchema, reason }: IUnexpectedFieldProps) {
  return (
    <div className="unsupported-field">
      <p>
        Unsupported field schema
        {idSchema && idSchema.$id && (
          <span>
            {' for'} field <code>{idSchema.$id}</code>
          </span>
        )}
        {reason && <em>: {reason}</em>}.
      </p>
      {schema && <pre>{JSON.stringify(schema, null, 2)}</pre>}
    </div>
  );
}

export default UnsupportedField;
