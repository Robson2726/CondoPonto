import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import fonts from '../theme/fonts';
import colors from '../theme/colors';

const mockData = [
  { id: '1', data: '2024-06-01', hora: '08:00', tipo: 'Entrada', pendente: false },
  { id: '2', data: '2024-06-01', hora: '17:30', tipo: 'Saída', pendente: false },
  { id: '3', data: '2024-06-02', hora: '08:05', tipo: 'Entrada', pendente: true },
  { id: '4', data: '2024-06-02', hora: '17:32', tipo: 'Saída', pendente: false },
];

const formatDateInput = (text) => {
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

export default function HistoryScreen() {
  const [pontos, setPontos] = useState(mockData);
  const [modalAjuste, setModalAjuste] = useState(false);
  const [dataAjuste, setDataAjuste] = useState('');
  const [horaAjuste, setHoraAjuste] = useState('');
  const [motivoAjuste, setMotivoAjuste] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemRow}>
        <Ionicons name={item.tipo === 'Entrada' ? 'arrow-down-circle' : 'arrow-up-circle'} size={18} color={item.tipo === 'Entrada' ? '#2ecc40' : '#e74c3c'} style={{ marginRight: 6 }} />
        <Ionicons name="time" size={15} color={colors.secondary} style={{ marginRight: 2 }} />
        <Text style={[styles.itemHora, item.tipo === 'Entrada' ? styles.entrada : styles.saida]}>{item.hora}</Text>
        <Ionicons name="calendar" size={15} color={colors.secondary} style={{ marginLeft: 10, marginRight: 2 }} />
        <Text style={styles.itemData}>{item.data}</Text>
      </View>
      {item.pendente && (
        <Text style={styles.pendenteLabel}>Pendente de aprovação</Text>
      )}
    </View>
  );

  const handleSolicitarAjuste = () => {
    if (!dataAjuste.match(/^\d{4}-\d{2}-\d{2}$/) || !horaAjuste.match(/^\d{2}:\d{2}$/)) {
      Alert.alert('Atenção', 'Preencha a data (AAAA-MM-DD) e hora (HH:MM) corretamente.');
      return;
    }
    if (!motivoAjuste.trim()) {
      Alert.alert('Atenção', 'Digite o motivo do ajuste.');
      return;
    }
    Alert.alert('Solicitação enviada', 'Seu ajuste ficará pendente de aprovação pelo adm.');
    setModalAjuste(false);
    setDataAjuste('');
    setHoraAjuste('');
    setMotivoAjuste('');
  };

  const renderFiltros = () => (
    <View style={styles.filtrosContainer}>
      <TouchableOpacity
        style={[styles.filtroBotao, filtro === 'Todos' && styles.filtroBotaoAtivo]}
        onPress={() => setFiltro('Todos')}
      >
        <Text style={[styles.filtroTexto, filtro === 'Todos' && styles.filtroTextoAtivo]}>Todos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filtroBotao, filtro === 'Pendentes' && styles.filtroBotaoAtivo]}
        onPress={() => setFiltro('Pendentes')}
      >
        <Text style={[styles.filtroTexto, filtro === 'Pendentes' && styles.filtroTextoAtivo]}>Pendentes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Histórico de Pontos</Text>
        {renderFiltros()}
        <FlatList
          data={filtro === 'Todos' ? pontos : pontos.filter(p => p.pendente)}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
        <TouchableOpacity style={styles.ajusteButtonGlobal} onPress={() => setModalAjuste(true)}>
          <Text style={styles.ajusteButtonGlobalText}>Solicitar Ajuste</Text>
        </TouchableOpacity>
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
    backgroundColor: 'colors.secondary', // cor clara para destacar os containers brancos
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.primary,
    marginBottom: 16,
    marginTop: 24,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
   
 
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemHora: {
    fontFamily: fonts.bold,
    fontSize: 14,
    marginRight: 20,
  },
  itemData: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.secondary,
    marginRight: 20,
  },
  entrada: {
    color: 'colors.secondary',
  },
  saida: {
    color: colors.secondary,
  },
  ajusteButtonGlobal: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10, // menor
    paddingHorizontal: 24, // menor
    alignItems: 'center',
    elevation: 3,
  },
  ajusteButtonGlobalText: {
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
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  pendenteLabel: {
    color: colors.primary,
    fontFamily: fonts.bold,
    fontSize: 13,
    marginTop: 4,
  },
  filtroBotao: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  filtroBotaoAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filtroTexto: {
    color: colors.secondary,
    fontFamily: fonts.bold,
    fontSize: 15,
  },
  filtroTextoAtivo: {
    color: '#fff',
  },
});
