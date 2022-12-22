import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '../server/trpc/router/_app';
import superjson from 'superjson';
import { createContextInner } from '../server/trpc/context';
import { trpc } from '../utils/trpc';
import { prisma } from '../server/db/client';
import MainLayout from '../components/MainLayout';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { v5 as uuidv5 } from 'uuid';
import DetailsField from '../components/DetailsField';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { personalDataSchemaWithoutId } from '../common/validation/personalData';
import { zodResolver } from '@hookform/resolvers/zod';
import { type PersonalDataWithoutId } from '../common/validation/personalData';
import clsx from 'clsx';
import { useQueryClient } from '@tanstack/react-query';

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>,
) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  });
  const id = context.params?.id as string;

  await ssg.personalData.byId.prefetch(id);

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const personalData = await prisma.personalData.findMany({
    select: { id: true },
  });

  return {
    paths: personalData?.map((data) => ({
      params: {
        id: data.id,
      },
    })),
    fallback: 'blocking',
  };
};

const User = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data } = trpc.personalData.byId.useQuery(id);
  const { mutate: updateData } = trpc.personalData.update.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalDataWithoutId>({
    resolver: zodResolver(personalDataSchemaWithoutId),
    mode: 'onTouched',
    defaultValues: !!data
      ? ({
          ...personalDataSchemaWithoutId.parse(data),
          birthDate: data.birthDate.toISOString().substring(0, 10),
        } as unknown as PersonalDataWithoutId)
      : undefined,
  });

  const toggleIsEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const isAdmin = useSession().status === 'authenticated';

  const onSubmit: SubmitHandler<PersonalDataWithoutId> = (data) => {
    updateData(
      { id, ...data },
      {
        onSuccess(data) {
          queryClient.setQueryData(
            [['personalData', 'byId'], { input: id, type: 'query' }],
            data,
          );
        },
      },
    );

    toggleIsEditing();
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

          {isAdmin ? (
            <div className="flex gap-3 justify-self-end">
              <button
                className="btn-success btn"
                type="button"
                onClick={toggleIsEditing}
              >
                Edit
              </button>
              <button className="btn-error btn" type="button">
                Delete
              </button>
            </div>
          ) : null}
        </div>

        <div className="card w-full bg-primary xl:mb-24">
          <div className={clsx(isEditing ? '' : 'gap-3', 'card-body')}>
            {!!data
              ? Object.keys(data).reduce((acc: JSX.Element[], key: string) => {
                  if (key === 'id') return acc;

                  const dataKey = key as keyof PersonalDataWithoutId;
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
                <button className="btn-success btn" type="submit">
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
