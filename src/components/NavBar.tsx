import Link from 'next/link';
import { type FC } from 'react';

const NavBar: FC = () => (
  <div className="navbar bg-neutral">
    <Link href="/" className="btn-ghost btn text-xl normal-case">
      Personal Data DBMS
    </Link>
  </div>
);

export default NavBar;
