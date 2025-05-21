import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import { Activity } from 'lucide-react-native';

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [fullName, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleNextStep = () => {
    if (step === 1) {
      // Validación básica del primer paso
      if (!fullName || !email || !password || !passwordConfirm) {
        setError('Por favor completa todos los campos');
        return;
      }
      if (password !== passwordConfirm) {
        setError('Las contraseñas no coinciden');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Aquí iría tu lógica de registro
      // await register({ fullName, email, password, age, weight, height, goalWeight });
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Error al registrar. Por favor intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#EFF6FF', justifyContent: 'center' }}>
      <View style={{ backgroundColor: 'white', borderRadius: 12, margin: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{ backgroundColor: '#3B82F6', padding: 12, borderRadius: 999 }}>
            <Activity size={40} color="#1f2937" />
          </View>
        </View>

        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, color: '#1F2937' }}>
          {step === 1 ? 'Crear una cuenta' : 'Información adicional'}
        </Text>

        {error && (
          <View style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 6, marginBottom: 16, borderWidth: 1, borderColor: '#FCA5A5' }}>
            <Text style={{ color: '#DC2626', textAlign: 'center' }}>{error}</Text>
          </View>
        )}

        <ScrollView>
          {step === 1 ? (
            <>
              <Input
                id="name"
                label="Nombre completo"
                value={fullName}
                onChange={setName}
                placeholder="Tu nombre"
                required
              />

              <Input
                id="email"
                label="Correo Electrónico"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="tu@email.com"
                required
              />

              <Input
                id="password"
                label="Contraseña"
                type="password"
                value={password}
                onChange={setPassword}
                required
              />

              <Input
                id="confirmPassword"
                label="Confirmar Contraseña"
                type="password"
                value={passwordConfirm}
                onChange={setConfirmPassword}
                required
              />
            </>
          ) : (
            <>
              <Input
                id="age"
                label="Edad"
                type="number"
                value={age}
                onChange={setAge}
                placeholder="Ej. 28"
                required
              />

              <Input
                id="weight"
                label="Peso actual (kg)"
                type="number"
                value={weight}
                onChange={setWeight}
                placeholder="Ej. 70"
                required
              />

              <Input
                id="height"
                label="Altura (cm)"
                type="number"
                value={height}
                onChange={setHeight}
                placeholder="Ej. 175"
                required
              />

              <Input
                id="goalWeight"
                label="Peso objetivo (kg)"
                type="number"
                value={goalWeight}
                onChange={setGoalWeight}
                placeholder="Ej. 65"
                required
              />
            </>
          )}
        </ScrollView>

        <View style={{ marginTop: 24 }}>
          {step === 1 ? (
            <Button
              onClick={handleNextStep}
              variant="primary"
              fullWidth
            >
              Siguiente
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Completar Registro'}
            </Button>
          )}
        </View>

        {step === 2 && (
          <Pressable onPress={() => setStep(1)} style={{ marginTop: 16 }}>
            <Text style={{ color: '#3B82F6', textAlign: 'center' }}>Volver</Text>
          </Pressable>
        )}

        <View style={{ marginTop: 24, alignItems: 'center' }}>
          <Text style={{ color: '#4B5563' }}>
            ¿Ya tienes una cuenta?{' '}
            <Link href="/auth/login" asChild>
              <Pressable>
                <Text style={{ color: '#1E40AF', fontWeight: '500' }}>Iniciar Sesión</Text>
              </Pressable>
            </Link>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Register;