import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import { Activity } from 'lucide-react-native';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Configuración de la petición Axios
      const response = await axios.post('http://192.168.1.12:8081/api/auth/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Si la respuesta es exitosa
      if (response.data && response.data.success) {
        // Guardar el token en AsyncStorage o contexto de autenticación
        // await AsyncStorage.setItem('userToken', response.data.token);
        
        // Navegar al dashboard
        router.push('/(tabs)/index');
      } else {
        setError(response.data.message || 'Error en el inicio de sesión');
      }
    } catch (err) {
      // Manejo de errores
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          setError(err.response.data.message || 'Error en las credenciales');
        } else if (err.request) {
          // La petición fue hecha pero no se recibió respuesta
          setError('No se recibió respuesta del servidor');
        } else {
          // Error al configurar la petición
          setError('Error al configurar la petición');
        }
      } else {
        setError('Error desconocido al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Activity size={40} color="#1f2937" />
          </View>
        </View>

        <Text style={styles.title}>
          Bienvenido a METAFIT Inicia Sesión
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
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

          <View style={styles.buttonContainer}>
            <Button
              onClick={handleSubmit}
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/register" asChild>
              <Pressable>
                <Text style={styles.linkText}>Regístrate</Text>
              </Pressable>
            </Link>
          </Text>
        </View>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#EFF6FF', // bg-blue-50 equivalent
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 24,
  },
  iconBackground: {
    backgroundColor: '#3B82F6', // metafit-blue equivalent
    padding: 12,
    borderRadius: 999,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937', // text-gray-800
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FEE2E2', // bg-red-100
    borderWidth: 1,
    borderColor: '#FCA5A5', // border-red-400
    borderRadius: 6,
    marginHorizontal: 16,
  },
  errorText: {
    color: '#DC2626', // text-red-700
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 24,
  },
  
  footer: {
    marginTop: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  footerText: {
    color: '#4B5563', // text-gray-600
  },
  linkText: {
    color: '#1E40AF', // text-metafit-blue-dark
    fontWeight: '500',
  },
});

export default Login;