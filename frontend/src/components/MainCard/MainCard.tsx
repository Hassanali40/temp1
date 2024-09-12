import * as React from 'react';
import { Stack, Text, IStackStyles, IStackTokens, ITextStyles } from '@fluentui/react';

// Define the props interface
interface MainCardProps {
    text: string;
    imgSrc: string;
}

// Stack styles
const cardStyles: IStackStyles = {
    root: {
        width: '200px',
        height: '188px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        background: ' var(--Colors-Background-bg-secondary, #F9FAFB)'
    },
};

// Text styles
const textStyles: ITextStyles = {
    root: {
        fontSize: '16px',
        color: '#333',
        fontStyle: 'normal',
        fontWeight: '400',
    },
};

// Icon styles
const iconStyles: React.CSSProperties = {
    height: '39px',
    width: '39px',
    marginLeft: 'auto',
};

// Tokens for spacing
const cardTokens: IStackTokens = { childrenGap: 12 };

export const MainCard: React.FunctionComponent<MainCardProps> = ({ text, imgSrc }) => {
    return (
        <Stack styles={cardStyles} tokens={cardTokens}>
            <Text styles={textStyles}>
                {text}
            </Text>
            <img src={imgSrc} style={iconStyles} aria-hidden="true" />
        </Stack>
    );
};
