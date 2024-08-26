import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { MessageBar, Stack, DefaultButton } from '@fluentui/react';

const Toast = forwardRef((props: any, ref) => {
    const { status } = props
    const { statusType } = props
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
        <Stack tokens={{ childrenGap: 10 }} style={{marginTop:20}}>
            {/* <DefaultButton text="Show Toast" onClick={showToast} /> */}
            {visible && (
                <MessageBar
                    messageBarType={statusType}
                    isMultiline={false}
                    onDismiss={() => setVisible(false)}
                >
                    {status}
                </MessageBar>
            )}
        </Stack>
    );
});

export default Toast;
