import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string; // Se puede ignorar o usar para debug
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  className = '',
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      default:
        return styles.primary;
    }
  };

  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      style={[
        styles.base,
        getVariantStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    fontWeight: '500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#3498db', // reemplaza con tu color 'metafit-blue'
  },
  secondary: {
    backgroundColor: '#2ecc71', // reemplaza con tu color 'metafit-green'
  },
  outline: {
    borderWidth: 1,
    borderColor: '#53db34',
    backgroundColor: 'transparent',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#2c3e50', // similar a 'text-gray-800'
  },
});

export default Button;
