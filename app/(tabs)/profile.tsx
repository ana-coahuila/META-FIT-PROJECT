import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { User as IconUser, Settings, LogOut } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface User {
  fullName: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  targetWeight: number;
  bmi?: number;
  bmiCategory?: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await axios.get('http://192.168.1.9:5000/api/auth/user', {
        headers: {
          'x-auth-token': token,
        },
      });

      const data = response.data;
      setUser(data);
      setFullName(data.fullName || '');
      setAge(data.age?.toString() || '');
      setWeight(data.weight?.toString() || '');
      setHeight(data.height?.toString() || '');
      setTargetWeight(data.targetWeight?.toString() || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'No se pudo cargar el perfil. Por favor, intenta nuevamente.');
      await AsyncStorage.removeItem('userToken');
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      await axios.put('http://192.168.1.9:5000/api/auth/user', data, {
        headers: {
          'x-auth-token': token,
        },
      });

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      await fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil. Verifica los datos e intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) newErrors.fullName = 'El nombre es requerido';
    if (!age || isNaN(parseInt(age)) || parseInt(age) < 18 || parseInt(age) > 30) 
      newErrors.age = 'Edad inválida (18-30 años)';
    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) < 30 || parseFloat(weight) > 300) 
      newErrors.weight = 'Peso inválido (30-300 kg)';
    if (!height || isNaN(parseInt(height)) || parseInt(height) < 100 || parseInt(height) > 250) 
      newErrors.height = 'Altura inválida (100-250 cm)';
    if (!targetWeight || isNaN(parseFloat(targetWeight)) || parseFloat(targetWeight) < 30 || parseFloat(targetWeight) > 300)
      newErrors.targetWeight = 'Objetivo inválido (30-300 kg)';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const updatedData = {
      fullName,
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseInt(height),
      targetWeight: parseFloat(targetWeight),
    };

    await updateUserProfile(updatedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!user) return;
    setFullName(user.fullName);
    setAge(user.age?.toString() || '');
    setWeight(user.weight?.toString() || '');
    setHeight(user.height?.toString() || '');
    setTargetWeight(user.targetWeight?.toString() || '');
    setErrors({});
    setIsEditing(false);
  };

  if (isLoading && !user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1D4ED8" />
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>No se pudo cargar la información del usuario</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchUserData}
        >
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const bmiValue = user.weight && user.height 
    ? (user.weight / ((user.height / 100) ** 2)).toFixed(2)
    : 'N/A';

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Bajo peso';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Sobrepeso';
    if (bmi < 35) return 'Obesidad I';
    if (bmi < 40) return 'Obesidad II';
    return 'Obesidad III';
  };

  const bmiCategory = bmiValue !== 'N/A' 
    ? getBMICategory(parseFloat(bmiValue))
    : 'N/A';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tu Perfil</Text>
        <View style={styles.iconContainer}>
          <IconUser size={24} color="#1F2937" />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.fullName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.fullName}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>
          {!isEditing && (
            <TouchableOpacity 
              onPress={() => setIsEditing(true)} 
              style={styles.editButton}
              disabled={isLoading}
            >
              <Settings size={16} color="#1F2937" />
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditing ? (
          <View style={styles.form}>
            {renderInput('Nombre completo', fullName, setFullName, errors.fullName)}
            {renderInput('Edad', age, setAge, errors.age, 'numeric')}
            {renderInput('Peso actual (kg)', weight, setWeight, errors.weight, 'numeric')}
            {renderInput('Altura (cm)', height, setHeight, errors.height, 'numeric')}
            {renderInput('Objetivo de peso (kg)', targetWeight, setTargetWeight, errors.targetWeight, 'numeric')}

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.cancelButton, isLoading && styles.disabledButton]} 
                onPress={handleCancel}
                disabled={isLoading}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, isLoading && styles.disabledButton]} 
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveText}>Guardar cambios</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.infoGrid}>
            {renderInfo('Edad', `${user.age} años`)}
            {renderInfo('Altura', `${user.height} cm`)}
            {renderInfo('Peso actual', `${user.weight} kg`)}
            {renderInfo('Objetivo de peso', `${user.targetWeight} kg`)}
            {renderInfo('IMC', bmiValue)}
            {renderInfo('Clasificación', bmiCategory)}
            {user.bmi && renderInfo('IMC calculado', user.bmi.toFixed(2))}
            {user.bmiCategory && renderInfo('Categoría', user.bmiCategory)}
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Configuración de la cuenta</Text>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={logout}
          disabled={isLoading}
        >
          <LogOut size={16} color="#DC2626" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const renderInput = (
  label: string,
  value: string,
  setValue: (val: string) => void,
  error?: string,
  keyboardType: 'default' | 'numeric' = 'default'
) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput 
      value={value} 
      onChangeText={setValue} 
      style={[styles.input, error ? styles.inputError : null]} 
      keyboardType={keyboardType}
      editable={!error}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const renderInfo = (label: string, value: string) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { 
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1F2937' 
  },
  iconContainer: { 
    backgroundColor: '#EFF6FF', 
    padding: 8, 
    borderRadius: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#DBEAFE',
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1E40AF' 
  },
  profileInfo: {
    flex: 1,
  },
  profileName: { 
    fontSize: 18, 
    fontWeight: '600',
    color: '#1F2937',
  },
  profileEmail: { 
    color: '#6B7280',
    fontSize: 14,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  editText: { 
    marginLeft: 6,
    color: '#4B5563',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: { 
    color: '#374151', 
    marginBottom: 8,
    fontWeight: '500',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  errorText: { 
    color: '#DC2626', 
    fontSize: 12,
    marginTop: 4,
  },
  form: { 
    marginTop: 8,
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 16,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelText: { 
    color: '#374151',
    fontWeight: '500',
  },
  saveButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveText: { 
    color: '#FFFFFF', 
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.6,
  },
  infoGrid: { 
    marginTop: 8,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: { 
    color: '#6B7280', 
    fontSize: 14,
  },
  infoValue: { 
    fontWeight: '500',
    fontSize: 16,
    color: '#1F2937',
    marginTop: 4,
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 12,
    color: '#1F2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  logoutText: { 
    color: '#DC2626', 
    marginLeft: 8,
    fontWeight: '500',
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default Profile;
