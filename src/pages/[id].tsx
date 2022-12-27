import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '../server/trpc/router/_app';
import superjson from 'superjson';
import { createContextInner } from '../server/trpc/context';
import { trpc } from '../utils/trpc';
import MainLayout from '../components/MainLayout';
import Link from 'next/link';
import { getSession, useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { v5 as uuidv5 } from 'uuid';
import DetailsField from '../components/DetailsField';
import { type SubmitHandler, useForm } from 'react-hook-form';
import {
  personalDataSchema,
  personalDataSchemaWithoutId,
} from '../common/validation/personalData';
import { zodResolver } from '@hookform/resolvers/zod';
import { type PersonalDataWithoutId } from '../common/validation/personalData';
import clsx from 'clsx';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import type { PersonalData } from '@prisma/client';

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext<{ id: string }>,
) => {
  const session = await getSession(ctx);
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  if (!!ctx.params?.id && !!session) {
    await ssg.personalData.byId.prefetch({ id: ctx.params.id });

    return {
      props: {
        trpcState: ssg.dehydrate(),
        id: ctx.params.id,
        session: await getSession(),
      },
    };
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

const User: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const isLoggedIn = useSession().status === 'authenticated';

  const getByIdQueryKey = useMemo(
    () => [['personalData', 'byId'], { input: id, type: 'query' }],
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalDataWithoutId>({
    resolver: zodResolver(personalDataSchemaWithoutId),
    mode: 'onTouched',
    defaultValues: !!data ? personalDataSchemaWithoutId.parse(data) : undefined,
  });

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

  return (
    <MainLayout className="mt-2 flex-col items-center justify-center md:mt-0">
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
                className={clsx(
                  'btn-error btn',
                  deleteLoading ? 'loading' : '',
                )}
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
            {!!data
              ? Object.keys(data).reduce((acc: JSX.Element[], key: string) => {
                  const dataKey = key as keyof PersonalData;

                  if (dataKey === 'id' || dataKey === 'userId') return acc;

                  const keyOfElement = uuidv5(
                    dataKey,
                    'bc4912ed-67a8-4e39-bb85-a26bb60f20fa',
                  );

                  return [
                    ...acc,
                    <DetailsField
                      key={keyOfElement}
                      fieldKey={dataKey}
                      fieldValue={data[dataKey]}
                      isEditing={isEditing}
                      error={errors[dataKey]}
                      register={register}
                    />,
                  ];
                }, [])
              : null}
            {isEditing ? (
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
            ) : null}
          </div>
        </div>
      </form>
    </MainLayout>
  );
};

export default User;
