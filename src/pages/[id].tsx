import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '../server/trpc/router/_app';
import superjson from 'superjson';
import { createContextInner } from '../server/trpc/context';
import MainLayout from '../layouts/MainLayout';
import { getSession } from 'next-auth/react';
import PersonalDataForm from '../components/forms/PersonalDataForm';

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
  return (
    <MainLayout className="mt-2 flex-col items-center justify-center md:mt-0">
      <PersonalDataForm id={id} />
    </MainLayout>
  );
};

export default User;
