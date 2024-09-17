import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Modal, StyleSheet, Alert,StatusBar,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


export default function Estoque() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [colorVariation, setColorVariation] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('@products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  const saveProducts = async (productsToSave) => {
    try {
      await AsyncStorage.setItem('@products', JSON.stringify(productsToSave));
    } catch (error) {
      console.error("Failed to save products:", error);
    }
  };

  const addProduct = () => {
    if (!productName.trim() || !quantity.trim() || !colorVariation.trim()) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (isNaN(quantity) || parseInt(quantity) <= 0) {
      alert("A quantidade deve ser um número positivo.");
      return;
    }

    let updatedProducts;
    if (editingProductId) {
      updatedProducts = products.map(product => 
        product.id === editingProductId 
          ? { ...product, name: productName, quantity: parseInt(quantity), colorVariation }
          : product
      );
      setEditingProductId(null);
    } else {
      const newProduct = {
        id: Math.random().toString(),
        name: productName,
        quantity: parseInt(quantity),
        colorVariation: colorVariation,
      };
      updatedProducts = [...products, newProduct];
    }

    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    closeModal();
  };

  const editProduct = (product) => {
    setProductName(product.name);
    setQuantity(product.quantity.toString());
    setColorVariation(product.colorVariation);
    setEditingProductId(product.id);
    setModalVisible(true);
  };

  const deleteProduct = (productId) => {
    Alert.alert(
      "Excluir Produto",
      "Você tem certeza que deseja excluir este produto?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: () => {
            const updatedProducts = products.filter(product => product.id !== productId);
            setProducts(updatedProducts);
            saveProducts(updatedProducts);
          }
        }
      ]
    );
  };

  const closeModal = () => {
    setProductName('');
    setQuantity('');
    setColorVariation('');
    setEditingProductId(null);
    setModalVisible(false);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    <View style={styles.container}>

    <StatusBar
        barStyle="dark-content" 
        backgroundColor="white" 
        translucent={false} 
         />
        

      <TextInput
        style={styles.input}
        placeholder="Pesquisar"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Button title="Adicionar Produto" color='#E0939D' onPress={() => setModalVisible(true)} />
      
      <FlatList Vertical={true} showsVerticalScrollIndicator={false}
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Text style={styles.productText}>Produto: {item.name}</Text>
            <Text style={styles.productText}>Quantidade: {item.quantity}</Text>
            <Text style={styles.productText}>Variação de Cor: {item.colorVariation}</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => editProduct(item)} style={styles.editButton}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteProduct(item.id)} style={styles.editButton}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Adicionar Produto</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do Produto"
            value={productName}
            onChangeText={setProductName}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Variação de Cor"
            value={colorVariation}
            onChangeText={setColorVariation}
          />
          
          <View style={styles.modalButtons}>
            <Button title="Salvar" color="#E0939D" onPress={addProduct} />
            <Button title="Cancelar" color="#E0939D" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
 
  input: {
    width:'100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  productContainer: {
    marginTop: 20,
    padding: 20,
    
    backgroundColor: '#f7f7f7',
        borderRadius: 20,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
         width: 0,
        height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 3,
  },
  productText: {
    fontSize: 18,
  },
  modalView: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  buttonText:{
    color:'white',

  },
  editButton: {
    backgroundColor: '#E0939D',
    padding: 10,
    borderRadius: 5,
  },
});

