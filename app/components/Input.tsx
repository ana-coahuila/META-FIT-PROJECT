import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface InputProps {
  id: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error,
}) => {
  const keyboardType = type === 'email'
    ? 'email-address'
    : type === 'number'
    ? 'numeric'
    : 'default';

  const secureTextEntry = type === 'password';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={String(value)}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4B5563', // text-gray-700
    marginBottom: 4,
  },
  required: {
    color: '#EF4444', // text-red-500
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // border-gray-300
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#EF4444', // border-red-500
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
