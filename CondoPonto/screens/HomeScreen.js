import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { registrarPonto, solicitarAjuste } from '../services/api';
import fonts from '../theme/fonts';
import colors from '../theme/colors';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

async function syncPontosComServidor() {
  const stored = await AsyncStorage.getItem('pontos');
  const pontos = stored ? JSON.parse(stored) : [];
  if (pontos.length === 0) return;
  // Simula envio para API
  try {
    // await fetch('https://suaapi.com/pontos', { method: 'POST', body: JSON.stringify(pontos) });
    await new Promise(resolve => setTimeout(resolve, 1000)); // simula delay
    await AsyncStorage.removeItem('pontos');
    Alert.alert('Sincronização', 'Pontos sincronizados com o servidor!');
  } catch (e) {
    // Falha na sincronização
  }
}

const formatDateInput = (text) => {
  // Remove tudo que não for número
  let cleaned = text.replace(/\D/g, '');
  if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
  let formatted = cleaned;
  if (cleaned.length > 4) {
    formatted = `${cleaned.slice(0,2)}/${cleaned.slice(2,4)}/${cleaned.slice(4)}`;
  } else if (cleaned.length > 2) {
    formatted = `${cleaned.slice(0,2)}/${cleaned.slice(2)}`;
  }
  return formatted;
};

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [modalHolerite, setModalHolerite] = useState(false);
  const [modalAjuste, setModalAjuste] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [motivoAjuste, setMotivoAjuste] = useState('');
  const [mesHolerite, setMesHolerite] = useState('');
  const [dataAjuste, setDataAjuste] = useState('');
  const [horaAjuste, setHoraAjuste] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation(null);
        setLoadingLocation(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setLoadingLocation(false);
    })();
  }, []);

  useEffect(() => {
    // Buscar nome do usuário logado
    const buscarNome = async () => {
      const nome = await AsyncStorage.getItem('nomeUsuario');
      setNomeUsuario(nome || 'Usuário');
    };
    buscarNome();
  }, []);

  useEffect(() => {
    const verificarESincronizar = async () => {
      const network = await Network.getNetworkStateAsync();
      if (network.isConnected && network.isInternetReachable) {
        await syncPontosComServidor();
      }
    };
    const interval = setInterval(verificarESincronizar, 10000); // verifica a cada 10s
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async () => {
    const now = new Date();
    const ponto = {
      id: `${now.getTime()}`,
      data: now.toISOString().slice(0, 10),
      hora: now.toTimeString().slice(0, 5),
      tipo: 'Registro',
      latitude: location ? location.coords.latitude : null,
      longitude: location ? location.coords.longitude : null,
    };
    try {
      // Salva localmente
      const stored = await AsyncStorage.getItem('pontos');
      const pontos = stored ? JSON.parse(stored) : [];
      pontos.push(ponto);
      await AsyncStorage.setItem('pontos', JSON.stringify(pontos));
      // Envia para API mock
      const res = await registrarPonto(ponto);
      if (res.success) {
        Alert.alert('Ponto registrado!', 'Seu ponto foi salvo e enviado para o servidor.');
      } else {
        Alert.alert('Ponto salvo localmente!', 'Falha ao enviar para o servidor.');
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o ponto.');
    }
  };

  const handleSolicitarAjuste = async () => {
    if (!dataAjuste.match(/^\d{4}-\d{2}-\d{2}$/) || !horaAjuste.match(/^\d{2}:\d{2}$/)) {
      Alert.alert('Atenção', 'Preencha a data (AAAA-MM-DD) e hora (HH:MM) corretamente.');
      return;
    }
    if (!motivoAjuste.trim()) {
      Alert.alert('Atenção', 'Digite o motivo do ajuste.');
      return;
    }
    try {
      await solicitarAjuste(null, motivoAjuste);
      Alert.alert('Solicitação enviada', 'Seu ajuste ficará pendente de aprovação pelo adm.');
      setModalAjuste(false);
      setDataAjuste('');
      setHoraAjuste('');
      setMotivoAjuste('');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível enviar a solicitação.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor="ffffff" />
      <View style={styles.topPurpleContainer}>
        <Text style={styles.topPurpleText}>Olá, {nomeUsuario}</Text>
      </View>
      <View style={[styles.container, { paddingTop: '38%' }]}> 
        <View style={{ height: 60 }} />
        <View style={styles.geoContainer}>
          <Text style={styles.geoLabel}>Localização atual:</Text>
          <Text style={styles.geoText}>
            {loadingLocation
              ? 'Localizando...'
              : location
              ? `Lat: ${location.coords.latitude.toFixed(5)} | Lon: ${location.coords.longitude.toFixed(5)}`
              : 'Sem permissão de localização'}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.iconCard}
              onPress={() => setModalAjuste(true)}
              activeOpacity={0.6}
            >
              <Ionicons name="create" size={34} color="#381560" />
              <Text style={styles.iconCardText}>Solicitar Ajuste</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconCard}
              onPress={() => setModalHolerite(true)}
              activeOpacity={0.6}
            >
              <Ionicons name="document-text" size={34} color="#381560" />
              <Text style={styles.iconCardText}>Baixar Holerite</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar Ponto</Text>
        </TouchableOpacity>
        <Modal
          visible={modalHolerite}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalHolerite(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Baixar holerite</Text>
              <TextInput
                style={styles.input}
                placeholder="Mês (AAAA-MM)"
                value={mesHolerite}
                onChangeText={setMesHolerite}
                keyboardType="numeric"
                maxLength={7}
              />
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => {
                  if (!mesHolerite.match(/^\d{4}-\d{2}$/)) {
                    Alert.alert('Atenção', 'Digite o mês no formato AAAA-MM.');
                    return;
                  }
                  Alert.alert('Download', `Holerite de ${mesHolerite} baixado! (mock)`);
                  setModalHolerite(false);
                  setMesHolerite('');
                }}
              >
                <Text style={styles.downloadButtonText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.fecharButton} onPress={() => setModalHolerite(false)}>
                <Text style={styles.fecharButtonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          visible={modalAjuste}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalAjuste(false)}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={60}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Solicitar Ajuste</Text>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="calendar" size={20} color={colors.secondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { paddingLeft: 36 }]}
                    placeholder="Data (DD/MM/AAAA)"
                    value={dataAjuste}
                    onChangeText={txt => setDataAjuste(formatDateInput(txt))}
                    maxLength={10}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="time" size={20} color={colors.secondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { paddingLeft: 36 }]}
                    placeholder="Hora (HH:MM)"
                    value={horaAjuste}
                    onChangeText={setHoraAjuste}
                    maxLength={5}
                    keyboardType="numeric"
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Motivo do ajuste"
                  value={motivoAjuste}
                  onChangeText={setMotivoAjuste}
                  multiline
                />
                <TouchableOpacity style={styles.downloadButton} onPress={handleSolicitarAjuste}>
                  <Text style={styles.downloadButtonText}>Enviar Solicitação</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fecharButton} onPress={() => setModalAjuste(false)}>
                  <Text style={styles.fecharButtonText}>Voltar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topPurpleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: '#381560',
    zIndex: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingLeft: 24,
    paddingBottom: 24,
  },
  topPurpleText: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 22,
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16,
    zIndex: 1,
  },
  geoContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 8,
    
 
  },
  geoLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.primary,
    marginBottom: 2,
  },
  geoText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.secondary,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.primary,
    marginBottom: 16,
    marginTop:40, // adiciona espaçamento superior
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10, // menor
    paddingHorizontal: 24, // menor
    alignItems: 'center',
    marginBottom: 12, // menor
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 16, // menor
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  iconCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 24,
    marginHorizontal: 4,
    alignItems: 'center',
  
    flexDirection: 'column',
    position: 'relative',
    elevation: 2,
  },
  iconCardText: {
    fontFamily: fonts.bold,
    color: '#381560',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.primary,
    marginBottom: 12,
  },
  input: {
    width: '100%',
    height: 44,
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: fonts.regular,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#f7f7f7',
  },
  inputIconContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 2,
  },
  downloadButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  fecharButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  fecharButtonText: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 16,
  },
});
