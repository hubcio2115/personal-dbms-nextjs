import { zodResolver } from '@hookform/resolvers/zod';
import { type PersonalData } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState, type FC } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { v5 as uuidv5 } from 'uuid';
import {
  personalDataSchema,
  personalDataSchemaWithoutId,
  type PersonalDataWithoutId,
} from '../../common/validation/personalData';
import Input from '../../layouts/Input';
import { trpc } from '../../utils/trpc';
import { splitCamelCaseAndCapitalize } from '../../utils/[id]';

type PersonalDataForm = {
  id: string;
};

const PersonalDataForm: FC<PersonalDataForm> = ({ id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const isLoggedIn = useSession().status === 'authenticated';

  const getByIdQueryKey = useMemo(
    () => [['personalData', 'byId'], { input: { id }, type: 'query' }],
    [id],
  );

  const { data } = trpc.personalData.byId.useQuery({ id });

  const { mutate: updateData, isLoading: updateLoading } =
    trpc.personalData.update.useMutation({
      onMutate: (mutationData) => {
        queryClient.setQueryData(getByIdQueryKey, mutationData);
      },
      onError: () => {
        queryClient.setQueryData(getByIdQueryKey, data);
      },
      onSuccess: () => {
        toggleIsEditing();
      },
    });

  const { mutate: deleteData, isLoading: deleteLoading } =
    trpc.personalData.delete.useMutation({
      onSettled: () => {
        router.push('/');
      },
    });

  const deleteValue = () => {
    deleteData({ id });
  };

  const toggleIsEditing = () => {
    if (!!data) {
      const { id: _dataId, ...newDefaultValues } =
        personalDataSchema.parse(data);

      reset(
        {
          ...newDefaultValues,
        },
        { keepDefaultValues: false },
      );
    }

    setIsEditing((prev) => !prev);
  };

  const onSubmit: SubmitHandler<PersonalDataWithoutId> = (data) => {
    updateData({ id, ...data });
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalDataWithoutId>({
    resolver: zodResolver(personalDataSchemaWithoutId),
    mode: 'onTouched',
    defaultValues: personalDataSchemaWithoutId.parse(data) ?? undefined,
  });

  return (
    <form
      className="mt-5 flex flex-auto flex-col justify-center gap-6 md:w-1/2 xl:w-1/3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex justify-between">
        <Link href="/">
          <button className="btn self-start">&#8592; back</button>
        </Link>

        {isLoggedIn ? (
          <div className="flex gap-3 justify-self-end">
            <button
              className="btn-success btn"
              type="button"
              onClick={toggleIsEditing}
            >
              Edit
            </button>
            <button
              className={clsx('btn-error btn', deleteLoading ? 'loading' : '')}
              disabled={deleteLoading}
              onClick={deleteValue}
              type="button"
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>

      <div className="card w-full bg-primary xl:mb-24">
        <div className={clsx(isEditing ? '' : 'gap-3', 'card-body')}>
          {!isEditing && !!data ? (
            Object.keys(data).reduce((acc: JSX.Element[], key) => {
              const valueKey = key as keyof PersonalData;

              if (valueKey === 'id' || valueKey === 'userId') return acc;

              return [
                ...acc,
                <p
                  key={uuidv5(valueKey, 'bc4912ed-67a8-4e39-bb85-a26bb60f20fa')}
                  className="card-title text-primary-content"
                >
                  {splitCamelCaseAndCapitalize(valueKey)}:{' '}
                  {valueKey === 'isPrivate'
                    ? data.isPrivate
                      ? '✅'
                      : '🚫'
                    : data[valueKey]}
                </p>,
              ];
            }, [])
          ) : (
            <>
              <Input
                label="First Name"
                errorMessage={errors.firstName?.message}
              >
                <input
                  type="text"
                  {...register('firstName')}
                  className={clsx(
                    'input input-md flex-auto',
                    !!errors.firstName ? 'input-bordered input-error' : '',
                  )}
                />
              </Input>

              <Input label="Last Name" errorMessage={errors.lastName?.message}>
                <input
                  type="text"
                  {...register('lastName')}
                  className={clsx(
                    'input input-md flex-auto',
                    !!errors.firstName ? 'input-bordered input-error' : '',
                  )}
                />
              </Input>

              <Input
                label="Maiden Name"
                errorMessage={errors.maidenName?.message}
              >
                <input
                  type="text"
                  {...register('maidenName')}
                  className={clsx(
                    'input input-md flex-auto',
                    !!errors.maidenName ? 'input-bordered input-error' : '',
                  )}
                />
              </Input>

              <Input label="Age" errorMessage={errors.age?.message}>
                <input
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  className={clsx(
                    'input input-md flex-auto',
                    !!errors.maidenName ? 'input-bordered input-error' : '',
                  )}
                />
              </Input>

              <Input label="Sex" errorMessage={errors.sex?.message}>
                <select
                  {...register('sex')}
                  defaultValue="-"
                  className="select"
                >
                  <option value="male">male</option>
                  <option value="female">female</option>
                </select>
              </Input>

              <Input label="Phone" errorMessage={errors.phone?.message}>
                <input
                  type="tel"
                  {...register('phone')}
                  className={clsx(
                    'input input-md flex-auto',
                    !!errors.maidenName ? 'input-bordered input-error' : '',
                  )}
                />
              </Input>

              <div className="form-control flex-row">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text mr-2">Is Private: </span>

                    <input
                      type="checkbox"
                      {...register('isPrivate')}
                      className="checkbox-success checkbox"
                    />
                  </label>
                </div>
              </div>

              <div className="card-actions justify-end">
                <button
                  className={clsx(
                    'btn-success btn',
                    updateLoading ? 'loading' : '',
                  )}
                  type="submit"
                  disabled={updateLoading}
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </form>
  );
};

export default PersonalDataForm;
