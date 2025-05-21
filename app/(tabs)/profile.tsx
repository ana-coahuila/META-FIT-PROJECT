import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { User as IconUser, Settings, LogOut } from 'lucide-react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

// Simulación de los datos del usuario y funciones
const user = {
  fullName: 'María López',
  email: 'maria@example.com',
  edad: 29,
  peso: 65,
  altura: 165,
  objetivopeso: 58,
};

const fetchUserData = async () => {
  // Simula llamada a API
};

const updateUserProfile = async (data: any) => {
  // Simula update de datos
  console.log('Actualizando perfil:', data);
};

const logout = () => {
  console.log('Sesión cerrada');
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [edad, setEdad] = useState(user?.edad?.toString() || '');
  const [peso, setPeso] = useState(user?.peso?.toString() || '');
  const [altura, setAltura] = useState(user?.altura?.toString() || '');
  const [objetivopeso, setObjetivopeso] = useState(user?.objetivopeso?.toString() || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const bmi =
    user.altura && user.peso
      ? (user.peso / ((user.altura / 100) ** 2)).toFixed(2)
      : 'N/A';

  const classification =
    bmi === 'N/A'
      ? 'N/A'
      : parseFloat(bmi) > 40
        ? 'Obesidad grado III'
        : parseFloat(bmi) > 35
          ? 'Obesidad grado II'
          : parseFloat(bmi) > 30
            ? 'Obesidad grado I'
            : parseFloat(bmi) > 25
              ? 'Sobrepeso'
              : 'Normal';

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'El nombre es requerido';
    if (!edad || parseInt(edad) < 18 || parseInt(edad) > 100) newErrors.edad = 'Edad inválida';
    if (!peso || parseFloat(peso) < 40 || parseFloat(peso) > 300) newErrors.peso = 'Peso inválido';
    if (!altura || parseInt(altura) < 120 || parseInt(altura) > 250) newErrors.altura = 'Altura inválida';
    if (!objetivopeso || parseFloat(objetivopeso) < 40 || parseFloat(objetivopeso) > 300)
      newErrors.objetivopeso = 'Objetivo de peso inválido';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    await updateUserProfile({
      fullName,
      edad: parseInt(edad),
      peso: parseFloat(peso),
      altura: parseInt(altura),
      objetivopeso: parseFloat(objetivopeso),
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setFullName(user.fullName);
    setEdad(user.edad?.toString() || '');
    setPeso(user.peso?.toString() || '');
    setAltura(user.altura?.toString() || '');
    setObjetivopeso(user.objetivopeso?.toString() || '');
    setErrors({});
    setIsEditing(false);
  };

  return (
    <ScrollView className="p-4 space-y-6">
      <View className="flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-800">Tu Perfil</Text>
        <View className="bg-[#57b1f6] p-2 rounded-full">
          <IconUser size={24} color="#1f2937" />
        </View>
      </View>

      <Card>
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <View className="h-16 w-16 rounded-full bg-[#9df78f] justify-center items-center mr-4">
              <Text className="text-2xl font-bold text-gray-800">
                {user.fullName?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text className="text-xl font-semibold">{user.fullName}</Text>
              <Text className="text-gray-600">{user.email}</Text>
            </View>
          </View>
          {!isEditing && (
            <Button variant="outline" onPress={() => setIsEditing(true)}>
              <Settings size={16} color="#1f2937" />
              <Text className="ml-2">Editar</Text>
            </Button>
          )}
        </View>

        {isEditing ? (
          <View>
            <Input label="Nombre completo" value={fullName} onChangeText={setFullName} error={errors.fullName} />
            <Input label="Edad (años)" value={edad} keyboardType="numeric" onChangeText={setEdad} error={errors.edad} />
            <Input label="Peso actual (kg)" value={peso} keyboardType="numeric" onChangeText={setPeso} error={errors.peso} />
            <Input label="Altura (cm)" value={altura} keyboardType="numeric" onChangeText={setAltura} error={errors.altura} />
            <Input label="Objetivo de peso (kg)" value={objetivopeso} keyboardType="numeric" onChangeText={setObjetivopeso} error={errors.objetivopeso} />
            <View className="flex-row space-x-3 mt-6">
              <Button variant="outline" onPress={handleCancel}>
                Cancelar
              </Button>
              <Button variant="primary" onPress={handleSubmit}>
                Guardar cambios
              </Button>
            </View>
          </View>
        ) : (
          <View className="space-y-4">
            {[
              { label: 'Edad', value: `${user.edad} años` },
              { label: 'Altura', value: `${user.altura} cm` },
              { label: 'Peso actual', value: `${user.peso} kg` },
              { label: 'Objetivo de peso', value: `${user.objetivopeso} kg` },
              { label: 'IMC', value: bmi },
              { label: 'Clasificación', value: classification },
            ].map((item, index) => (
              <View key={index}>
                <Text className="text-sm text-gray-600">{item.label}</Text>
                <Text className="font-medium">{item.value}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      <Card>
        <Text className="text-lg font-medium mb-4">Configuración de la cuenta</Text>
        <Button variant="outline" onPress={logout} className="border-red-200">
          <LogOut size={16} color="red" />
          <Text className="ml-2 text-red-600">Cerrar sesión</Text>
        </Button>
      </Card>
    </ScrollView>
  );
};

export default Profile;
