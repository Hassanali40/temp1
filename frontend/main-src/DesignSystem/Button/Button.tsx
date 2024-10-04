import React from 'react';
import { Button, buttonVariants } from '../../components/ui/button';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IButtonProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  link?: string;
  variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function ButtonCustom({
  children,
  onClick,
  link,
  variant,
  className,
  size,
  isLoading,
  disabled,
}: IButtonProps) {
  if (isLoading) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading ...
      </Button>
    );
  }

  if (link) {
    return (
      <Link to={link} className={buttonVariants({ variant: 'outline' })}>
        {children}
      </Link>
    );
  }

  return (
    <Button onClick={onClick} variant={variant} className={className} size={size} disabled={disabled}>
      {children}
    </Button>
  );
}
