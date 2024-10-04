import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

type options = {
  label: React.ReactNode;
  action: () => void;
};

interface IMenu {
  renderTrigger: () => React.ReactNode;
  options: options[];
}

export default function Menu({ renderTrigger, options = [] }: IMenu) {
  const [open, setOpen] = useState(false);

  const handleClickOnItem = (e: React.MouseEvent<HTMLDivElement>, action: () => void) => {
    e.stopPropagation();
    e.preventDefault();

    if (typeof action === 'function') {
      action();
      setOpen(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={(e) => setOpen(e)}>
      <DropdownMenuTrigger onClick={() => setOpen(true)} className="outline-none">
        {renderTrigger()}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map(({ label, action }, i) => (
          <DropdownMenuItem key={i} onClick={(e) => handleClickOnItem(e, action)}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
