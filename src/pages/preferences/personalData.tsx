import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  personalDataSchemaWithoutId,
  type PersonalDataWithoutId,
} from '~/common/validation/personalData';
import Input from '~/layouts/Input';
import SettingsLayout from '~/layouts/SettingsLayout';
import { api } from '~/utils/api';

export default function PersonalData() {
  const { data: personalData } = api.personalData.byUserId.useQuery();
  const queryClient = useQueryClient();
  const { data: userData } = useSession();
  const queryId = useMemo(
    () => [['personalData', 'byUserId'], { type: 'query' }],
    [],
  );

  const { mutate: upsertPersonalData, isLoading } =
    api.personalData.upsert.useMutation({
      onMutate: (mutationData) => {
        queryClient.setQueryData(queryId, mutationData);
      },
      onError: () => {
        queryClient.setQueriesData(queryId, personalData);
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalDataWithoutId>({
    resolver: zodResolver(personalDataSchemaWithoutId),
    mode: 'onTouched',
  });

  useEffect(() => {
    if (!!personalData) {
      const { id: _id, ...data } = personalData;

      reset(data);
    }
  }, [reset, personalData]);

  useEffect(() => {
    if (!!userData) {
      reset({ userId: userData.user.id });
    }
  }, [reset, userData]);

  const onSubmit = (data: PersonalDataWithoutId) => {
    upsertPersonalData(data);
  };

  return (
    <SettingsLayout>
      <h2>Personal Data</h2>

      <div className="divider" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="First Name" errorMessage={errors.firstName?.message}>
          <input
            type="text"
            {...register('firstName')}
            className={clsx(
              'input input-md w-96 flex-auto bg-base-300',
              !!errors.firstName ? 'input-bordered input-error' : '',
            )}
          />
        </Input>

        <Input label="Last Name" errorMessage={errors.lastName?.message}>
          <input
            type="text"
            {...register('lastName')}
            className={clsx(
              'input input-md w-96 flex-auto bg-base-300',
              !!errors.lastName ? 'input-bordered input-error' : '',
            )}
          />
        </Input>

        <Input label="Maiden Name" errorMessage={errors.maidenName?.message}>
          <input
            type="text"
            {...register('maidenName')}
            className={clsx(
              'input input-md w-96 flex-auto bg-base-300',
              !!errors.maidenName ? 'input-bordered input-error' : '',
            )}
          />
        </Input>

        <Input label="Age" errorMessage={errors.age?.message}>
          <input
            type="number"
            {...register('age', { valueAsNumber: true })}
            className={clsx(
              'input input-md w-96 flex-auto bg-base-300',
              !!errors.age ? 'input-bordered input-error' : '',
            )}
          />
        </Input>

        <Input label="Sex" errorMessage={errors.sex?.message}>
          <select
            {...register('sex')}
            defaultValue="-"
            className="select w-96 bg-base-300"
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
              'input input-md w-96 flex-auto bg-base-300',
              !!errors.phone ? 'input-bordered input-error' : '',
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

        <button
          className={clsx(
            'btn-success btn-sm btn mt-5',
            isLoading ? 'loading' : '',
          )}
          type="submit"
          disabled={isLoading}
        >
          Submit
        </button>
      </form>
    </SettingsLayout>
  );
}
