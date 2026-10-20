import Link from 'next/link';
import React from 'react';
import UseLoadingRouter from '../hooks/useLoadingRoutes';

function GlobalLink({
  href,
  children,
  ...props
}: { href: string; children: React.ReactNode } & React.ComponentProps<typeof Link>) {
  const router = UseLoadingRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default link navigation
    router.push(href); // Programmatically navigate
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

export default GlobalLink;
