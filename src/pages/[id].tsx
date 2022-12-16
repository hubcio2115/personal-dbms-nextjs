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
    <>
      <h1>{data?.firstName}</h1>
    </>
  );
};

export default User;
