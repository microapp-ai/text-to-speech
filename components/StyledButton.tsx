import React from 'react';
import { Button, rem } from '@mantine/core';

type StyledButtonProps = {
  app_theme: any;
  loading: any;
  disabled: any;
  handleConvert: any;
  button_label: any;
  icon: any;
};

const StyledButton: React.FC<StyledButtonProps> = ({
  app_theme,
  loading,
  disabled,
  handleConvert,
  button_label,
  icon,
}) => {
  return (
    <div>
      <Button
        onClick={handleConvert}
        miw={'108px'}
        disabled={disabled}
        loading={loading}
        radius={'xl'}
        variant={app_theme !== 'dark' ? 'filled' : 'outline'}
        color="dark"
        size="lg"
        styles={{
          root: {
            color: app_theme === 'light' ? '#ffffff' : '#000000',
            backgroundColor:
              app_theme === 'light'
                ? loading
                  ? '#1440b8'
                  : '#000000'
                : loading
                ? '#7d9cf1'
                : '#ffff',
            border: 0,
            height: rem(42),
            paddingLeft: rem(20),
            paddingRight: rem(20),
            '&[data-loading]::before': {
              backgroundColor: 'transparent !important',
            },
            '&:hover': {
              backgroundColor: app_theme === 'dark' ? '#a8bdf5' : '#184dcc',
            },
            '&:disabled': {
              color: app_theme === 'dark' ? '#76767F' : '#909098',
              backgroundColor: app_theme === 'dark' ? '#2C2C30' : '#dfdfe2',
            },
          },
          icon: {
            marginRight: '0 !important',
          },
        }}
        leftIcon={icon}
      >
        {loading ? '' : button_label}
      </Button>
    </div>
  );
};

export default StyledButton;
