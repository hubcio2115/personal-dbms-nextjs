import clsx from 'clsx';
import { type HTMLInputTypeAttribute, useMemo } from 'react';
import type { FieldError, UseFormRegister } from 'react-hook-form';
import { type PersonalDataWithoutId } from '../common/validation/personalData';
import { splitCamelCaseAndCapitalize } from '../utils/[id]';

type DetailsFieldProps = {
  fieldKey: keyof Omit<PersonalDataWithoutId, 'userId'>;
  fieldValue: PersonalDataWithoutId[DetailsFieldProps['fieldKey']];
  isEditing: boolean;
  register: UseFormRegister<PersonalDataWithoutId>;
  error?: FieldError;
};

const DetailsField = ({
  fieldKey,
  fieldValue,
  isEditing,
  error,
  register,
}: DetailsFieldProps) => {
  const label = splitCamelCaseAndCapitalize(fieldKey);
  const inputType = useMemo((): HTMLInputTypeAttribute => {
    if (fieldKey === 'phone') return 'tel';

    if (fieldKey in ['age', 'height', 'weight']) return 'number';

    return 'text';
  }, [fieldKey]);

  return isEditing ? (
    <div className="form-control">
      <label className="label text-primary-content">
        <span className="label-text">{label}:</span>
      </label>
      {fieldKey === 'sex' ? (
        <select {...register(fieldKey)} defaultValue="-" className="select">
          <option value="male">male</option>
          <option value="female">female</option>
        </select>
      ) : (
        <input
          type={inputType}
          {...register(fieldKey, {
            valueAsNumber: !!['age', 'height', 'weight'].find(
              (el) => fieldKey === el,
            ),
          })}
          className={clsx(
            'input input-md flex-auto',
            !!error ? 'input-bordered input-error' : '',
          )}
        />
      )}
      <label className="label">
        {!!error ? (
          <span className="label-text-alt">{error.message}</span>
        ) : null}
      </label>
    </div>
  ) : (
    <p className="card-title text-primary-content">
      {`${label}: ${fieldValue}`}
    </p>
  );
};

export default DetailsField;
