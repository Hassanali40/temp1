import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { MessageBar, MessageBarType, Stack } from '@fluentui/react';

interface IToast {
  status: string;
  statusType: MessageBarType;
}

const Toast = forwardRef(function ToastComponent({ status, statusType }: IToast, ref) {
  const [visible, setVisible] = useState(false);

  const showToast = () => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 3000);
  };

  useImperativeHandle(ref, () => ({
    showToast,
  }));

  return (
    <Stack tokens={{ childrenGap: 10 }} style={{ marginTop: 20 }}>
      {/* <DefaultButton text="Show Toast" onClick={showToast} /> */}
      {visible && (
        <MessageBar messageBarType={statusType} isMultiline={false} onDismiss={() => setVisible(false)}>
          {status}
        </MessageBar>
      )}
    </Stack>
  );
});

export default Toast;
