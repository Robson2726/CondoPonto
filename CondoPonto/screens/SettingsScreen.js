import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import fonts from '../theme/fonts';
import colors from '../theme/colors';

export default function SettingsScreen({ onLogout }) {
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [modalPerfil, setModalPerfil] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Ajustes</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Notificações</Text>
          <TouchableOpacity
            style={[styles.switch, notificacoesAtivas ? styles.switchOn : styles.switchOff]}
            activeOpacity={0.8}
            onPress={() => setNotificacoesAtivas(!notificacoesAtivas)}
          >
            <Animated.View
              style={[
                styles.switchCircle,
                notificacoesAtivas ? styles.switchCircleOn : styles.switchCircleOff,
              ]}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.perfilButton} onPress={() => setModalPerfil(true)}>
          <Text style={styles.perfilButtonText}>Visualizar Perfil</Text>
        </TouchableOpacity>
        <Modal
          visible={modalPerfil}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalPerfil(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Perfil</Text>
              <Text style={styles.modalText}>Nome: Usuário Teste</Text>
              <Text style={styles.modalText}>Cargo: Funcionário</Text>
              <TouchableOpacity style={styles.fecharButton} onPress={() => setModalPerfil(false)}>
                <Text style={styles.fecharButtonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Ionicons name="log-out" size={22} color={colors.primary} style={{ marginRight: 15 }} />
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.primary,
    marginBottom: 24,
    marginTop: 45,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 18,
    color: colors.text,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eee',
    justifyContent: 'center',
    padding: 3,
  },
  switchOn: {
    backgroundColor: colors.primary,
    alignItems: 'flex-end',
  },
  switchOff: {
    backgroundColor: '#eee',
    alignItems: 'flex-start',
  },
  switchCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  switchCircleOn: {
    backgroundColor: '#fff',
  },
  switchCircleOff: {
    backgroundColor: '#fff',
  },
  perfilButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10, // menor
    paddingHorizontal: 24, // menor
    alignItems: 'center',
    marginBottom: 12, // menor
  },
  perfilButtonText: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 16, // menor
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
  modalText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  fecharButton: {
    marginTop: 12, // menor
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 8, // menor
    paddingHorizontal: 18, // menor
  },
  fecharButtonText: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 15, // menor
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 160,
  },
  logoutButtonText: {
    color: 'colors.primary',
    fontFamily: fonts.bold,
    fontSize: 16,
  },
});
