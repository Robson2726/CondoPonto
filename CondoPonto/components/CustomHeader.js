import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import fonts from '../theme/fonts';

export default function CustomHeader({ title }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: '#2566ff',
  },
});
