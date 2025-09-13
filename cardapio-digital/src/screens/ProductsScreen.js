// src/screens/ProductsScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Button,
  TextInput,
} from 'react-native';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

export default function ProductsScreen() {
  const { items, loading, error, reload } = useProducts();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();

  console.log(items)
  
  const filteredItems = !q
    ? items
    : items.filter((p) => {
        const idStr = String(p.id || '');
        const haystack = `${idStr} ${p.name || ''} ${p.sku || ''} ${p.description || ''}`
          .toLowerCase();
        return haystack.includes(q);
      });

  // Carregamento inicial
  if (loading && items.length === 0) {
    return (
      <SafeAreaView style={styles.containerCenter}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Carregando produtos...</Text>
      </SafeAreaView>
    );
  }

  // Erro inicial (sem dados)
  if (error && items.length === 0) {
    return (
      <SafeAreaView style={styles.containerCenter}>
        <Text style={[styles.infoText, { color: 'red', textAlign: 'center' }]}>
          {error}
        </Text>

        <View style={{ height: 12 }} />
        <Button title="Tentar novamente" onPress={reload} />

        <View style={{ height: 12 }} />
        <Text style={styles.hint}>
          Verifique o API_URL em <Text style={styles.code}>src/data/config.js</Text>{' '}
          e teste a rota <Text style={styles.code}>/products</Text> no navegador do
          emulador/celular.
        </Text>
      </SafeAreaView>
    );
  }

  // Lista de produtos
  return (
  <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Produtos</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por ID, nome, SKU ou descrição"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <Button title="Recarregar" onPress={reload} />
      </View>

      {!!error && items.length > 0 && (
        <View style={styles.bannerError}>
          <Text style={styles.bannerErrorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={
          filteredItems.length === 0 ? styles.listEmpty : styles.list
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: 24 }}>
            {query.trim() ? (
              <Text>Nenhum produto encontrado para "{query}".</Text>
            ) : (
              <Text>Nenhum produto cadastrado.</Text>
            )}
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={reload} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f7f7f7',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 20, fontWeight: '700' },
  list: { paddingBottom: 16 },
  listEmpty: { flexGrow: 1, justifyContent: 'center' },
  infoText: { marginTop: 10, fontSize: 14 },
  hint: { fontSize: 12, color: '#555', textAlign: 'center' },
  code: { fontFamily: 'monospace' },
  bannerError: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#ffe6e6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  bannerErrorText: { color: '#b30000', fontSize: 12 },
  searchInput: { flex: 1, marginHorizontal: 8, paddingHorizontal: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, height: 36
  },
});
