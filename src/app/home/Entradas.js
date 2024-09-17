import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, TouchableOpacity, Platform,StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Entradas() {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    saveTransactions();
  }, [transactions]);

  const saveTransactions = async () => {
    try {
      const jsonValue = JSON.stringify(transactions);
      await AsyncStorage.setItem('@transactions', jsonValue);
    } catch (e) {
      Alert.alert('Erro ao salvar as transações.');
    }
  };

  const loadTransactions = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@transactions');
      if (jsonValue != null) {
        setTransactions(JSON.parse(jsonValue));
      }
    } catch (e) {
      Alert.alert('Erro ao carregar as transações.');
    }
  };

  const addTransaction = (type) => {
    if (!description || !amount) {
      Alert.alert('Por favor, insira uma descrição e um valor.');
      return;
    }
  
    const newTransaction = {
      id: Math.random().toString(),
      description,
      amount: parseFloat(amount) * (type === 'income' ? 1 : -1),
      date: date.toLocaleDateString('pt-BR'), 
    };
  
    
    setTransactions([newTransaction, ...transactions]);
    
    setAmount('');
    setDescription('');
    setDate(new Date()); 
  };
  
  

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
  };

  const getTotal = () => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content" 
        backgroundColor="white" 
        translucent={false} 
         />
      <Text style={styles.title}>Adicionar Entradas</Text>

      <TextInput
        placeholder="Descrição"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        placeholder="Valor (R$)"
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>
          Data: {date.toLocaleDateString('pt-BR')}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <View style={styles.buttonsContainer}>
        <Button title="Adicionar Receita" color='#E0939D' onPress={() => addTransaction('income')} />
      </View>

      <View style={styles.containerTotal}>
      <Text style={styles.total}>R${getTotal().toFixed(2)}</Text>
      </View>

      <FlatList Vertical={true} showsVerticalScrollIndicator={false}
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <View>
              <Text>{item.description}</Text>
              <Text style={styles.dateLabel}>Data: {item.date}</Text>
            </View>
            <Text style={{ color: item.amount >= 0 ? 'green' : 'red' }}>
              {item.amount >= 0 ? '+' : '-'}R${Math.abs(item.amount).toFixed(2)}
            </Text>
            <TouchableOpacity onPress={() => deleteTransaction(item.id)}style={styles.editButton}>
              <Text style={styles.deleteButton}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    textAlign:'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height:45,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  dateText: {
    height:45,
    color:'grey',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 14,
    color: '#777',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  containerTotal:{
    justifyContent: 'center',
    marginLeft:35,
    marginVertical: 20,
    alignItems:'center',
    textAlign: 'center',

    backgroundColor:'white',
        width:'80%',
        borderRadius:30,
        padding:20,

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
  total: {
    justifyContent:'center',
    color:'#E0939D',
    fontSize:20,

  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
        borderRadius: 20,
        marginBottom: 10,
        shadowColor: 'grey',
        shadowOffset: {
         width: 0,
        height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 3,
  },
  deleteButton: {
    color: 'white',
  },
  editButton:{
    backgroundColor: '#E0939D',
    padding: 10,
    borderRadius: 5,
  },
});
