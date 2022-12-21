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
import { type PersonalData } from '@prisma/client';
import { splitCamelCaseAndCapitalize } from '../utils/[id]';
import Link from 'next/link';

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
  const { data } = trpc.personalData.byId.useQuery(id);

  return (
    <MainLayout className="mt-2 flex-col items-center justify-center md:mt-0">
      <div className="flex flex-auto flex-col justify-center gap-6 md:w-1/2 xl:w-1/3">
        <div>
          <Link href="/">
            <button className="btn self-start">&#8592; back</button>
          </Link>
        </div>

        <div className="card w-full bg-primary xl:mb-24">
          <div className="card-body">
            {!!data
              ? Object.keys(data).reduce(
                  (acc: JSX.Element[], key: string, index) => {
                    if (key === 'id') return acc;

                    const label = splitCamelCaseAndCapitalize(key);
                    return [
                      ...acc,
                      <p
                        className="text- card-title text-primary-content"
                        key={index}
                      >
                        {`${label}: `} {data[key as keyof PersonalData]}
                      </p>,
                    ];
                  },
                  [],
                )
              : null}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default User;
