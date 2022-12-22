import { type PersonalData } from '@prisma/client';
import clsx from 'clsx';
import { type HTMLInputTypeAttribute, useMemo } from 'react';
import type { FieldError, UseFormRegister } from 'react-hook-form';
import { type PersonalDataWithoutId } from '../common/validation/personalData';
import { splitCamelCaseAndCapitalize } from '../utils/[id]';

type DetailsFieldProps = {
  fieldKey: keyof Omit<PersonalData, 'id'>;
  fieldValue: PersonalData[DetailsFieldProps['fieldKey']];
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
    if (fieldKey === 'birthDate') return 'date';

    if (fieldKey === 'email') return 'email';

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
            valueAsDate: fieldKey === 'birthDate',
            valueAsNumber: !!['age', 'height', 'weight'].find(
              (el) => fieldKey === el,
            ),
          })}
          max={
            fieldKey === 'birthDate'
              ? new Date().toISOString().substring(0, 10)
              : undefined
          }
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
      {`${label}: ${
        fieldValue instanceof Date
          ? fieldValue.toLocaleString().substring(0, 10)
          : fieldValue
      }`}
    </p>
  );
};

export default DetailsField;
