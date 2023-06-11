import type { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import SettingsLayout from '~/layouts/SettingsLayout';
import { redirectIfSession } from '~/utils/redirectIfSession';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx);

  return redirectIfSession(session, false, '/', ctx);
}

export default function Preferences() {
  const { data: userData } = useSession();

  return (
    <SettingsLayout>
      <h2>General</h2>

      <div className="divider">Email</div>

      <p>{userData?.user.email}</p>

      <h2>Info</h2>

      <Link href="/privacyPolicy">privacy policy</Link>
    </SettingsLayout>
  );
}
