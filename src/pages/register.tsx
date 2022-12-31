import { type GetServerSideProps, type NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import RegisterForm from '../components/forms/RegisterForm';
import MainLayout from '../layouts/MainLayout';
import { redirectIfSession } from '../utils/redirectIfSession';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  return redirectIfSession(session, true, '/dashboard', ctx);
};

const Register: NextPage = () => (
  <MainLayout className="mt-2 flex-col items-center justify-center md:mt-0">
    <Head>
      <title>Register</title>
    </Head>

    <RegisterForm />
  </MainLayout>
);

export default Register;
