import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from 'next';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import superjson from 'superjson';
import { createInnerTRPCContext } from '~/server/api/trpc';
import MainLayout from '~/layouts/MainLayout';
import { getSession } from 'next-auth/react';
import PersonalDataForm from '~/components/forms/PersonalDataForm';
import Head from 'next/head';
import { type DehydratedState } from '@tanstack/react-query';
import { type Session } from 'next-auth';

export async function getServerSideProps(
  ctx: GetServerSidePropsContext<{ id: string }>,
): Promise<
  GetServerSidePropsResult<{
    id: string;
    trpcState: DehydratedState;
    session: Session | null;
  }>
> {
  const session = await getSession(ctx);
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
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
}

export default function User({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout className="mt-2 flex-col items-center justify-center md:mt-0">
      <Head>
        <title>Personal Data</title>
      </Head>

      <PersonalDataForm id={id} />
    </MainLayout>
  );
}
