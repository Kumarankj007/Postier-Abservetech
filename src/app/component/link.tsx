import React, { useTransition } from 'react';
import Link from 'next/link';
import useTransitionStore from '../store/transition';
import UseLoadingRouter from "../hooks/useLoadingRoutes";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const TransitionLink: React.FC<TransitionLinkProps> = ({ href, children, className, onClick }) => {
  const { setPending } = useTransitionStore();
   const  router  = UseLoadingRouter();;
  const [, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (onClick) onClick(e);
    setPending(true);
    startTransition(() => {
      router.push(href); 
      setPending(false);
    });
  };

  return (
    <>
      <Link href={href} onClick={handleClick} className={className}>
        {children}
      </Link>
    </>
  );
};

export default TransitionLink;
