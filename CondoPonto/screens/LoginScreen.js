import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fonts from '../theme/fonts';
import colors from '../theme/colors';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username === 'admin' && password === '123') {
      await AsyncStorage.setItem('nomeUsuario', username);
      onLogin();
    } else {
      Alert.alert('Erro', 'Usuário ou senha inválidos');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          placeholderTextColor="#d1cbe7"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#d1cbe7"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#381560',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 230,
    height: 230,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#3f2161',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    fontFamily: fonts.regular,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#fff',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#381560',
    fontFamily: fonts.bold,
    fontSize: 16,
  },
});
