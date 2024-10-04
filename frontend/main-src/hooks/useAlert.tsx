import { useState } from 'react';
import { IDialog } from '../DesignSystem/Alert/Alert';

export default function useAlertDialog() {
  const [alertData, setAlertData] = useState<Omit<IDialog, 'open'> | null>(null);

  return {
    setAlertData,
    dialogProps: { ...alertData, open: alertData !== null } as IDialog,
    isOpenDialog: alertData !== null,
  };
}
