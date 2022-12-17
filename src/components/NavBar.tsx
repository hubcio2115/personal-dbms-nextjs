import Link from 'next/link';

const NavBar = () => (
  <div className="navbar bg-neutral">
    <Link href="/" className="btn-ghost btn text-xl normal-case">
      Personal Data DBMS
    </Link>
  </div>
);

export default NavBar;
