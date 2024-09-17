import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Modal, TouchableOpacity, StyleSheet,StatusBar,ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Metas() {
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [goalValue, setGoalValue] = useState('');
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    filterGoals();
  }, [goals, searchText]);

  const loadGoals = async () => {
    try {
      const savedGoals = await AsyncStorage.getItem('@goals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    } catch (error) {
      console.error('Failed to load goals', error);
    }
  };

  const saveGoals = async (goals) => {
    try {
      await AsyncStorage.setItem('@goals', JSON.stringify(goals));
    } catch (error) {
      console.error('Failed to save goals', error);
    }
  };

  const addGoal = () => {
    if (goalTitle && goalDescription && goalValue) {
      let updatedGoals;
      if (editingGoalId) {
        
        updatedGoals = goals.map(goal =>
          goal.id === editingGoalId
            ? { ...goal, title: goalTitle, description: goalDescription, startDate, endDate, value: parseFloat(goalValue) }
            : goal
        );
        setEditingGoalId(null);
      } else {
        // Add new goal
        const newGoal = {
          id: Math.random().toString(),
          title: goalTitle,
          description: goalDescription,
          startDate,
          endDate,
          value: parseFloat(goalValue),
        };
        updatedGoals = ([...goals, newGoal]);
      }

      setGoals(updatedGoals);
      saveGoals(updatedGoals);

      setGoalTitle('');
      setGoalDescription('');
      setGoalValue('');
      setModalVisible(false);
    }
  };

  const editGoal = (goal) => {
    setGoalTitle(goal.title);
    setGoalDescription(goal.description);
    setStartDate(new Date(goal.startDate));
    setEndDate(new Date(goal.endDate));
    setGoalValue(goal.value.toString());
    setEditingGoalId(goal.id);
    setModalVisible(true);
  };

  const deleteGoal = async (goalId) => {
    try {
      
      const updatedGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(updatedGoals);
  
      
      await AsyncStorage.setItem('@goals', JSON.stringify(updatedGoals));
    } catch (error) {
      console.error('Failed to delete goal', error);
    }
  };
  

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const filterGoals = () => {
    if (searchText) {
      setFilteredGoals(goals.filter(goal =>
        goal.title.toLowerCase().includes(searchText.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchText.toLowerCase())
      ));
    } else {
      setFilteredGoals(goals);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content" 
        backgroundColor="white" 
        translucent={false} 
         />

      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar"
        value={searchText}
        onChangeText={setSearchText}
      />

      <Button
        title="Adicionar Meta"
        color="#E0939D"
        onPress={() => {
          setGoalTitle('');
          setGoalDescription('');
          setStartDate(new Date());
          setEndDate(new Date());
          setGoalValue('');
          setEditingGoalId(null);
          setModalVisible(true);
        }}
      />

      <FlatList Vertical={true} showsVerticalScrollIndicator={false}
        data={filteredGoals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalContainer}>
            <Text style={styles.goalTitle}>{item.title}</Text>
            <Text style={styles.goalDescription}>{item.description}</Text>
            <Text style={styles.goalText}>Início: {format(new Date(item.startDate), 'dd/MM/yyyy', { locale: ptBR })}</Text>
            <Text style={styles.goalText}>Limite: {format(new Date(item.endDate), 'dd/MM/yyyy', { locale: ptBR })}</Text>
            <Text style={styles.goalText}>Valor(R$): R$ {item.value.toFixed(2)}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => editGoal(item)} style={styles.editButton}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteGoal(item.id)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Excluir </Text>
              </TouchableOpacity>
            </View>
          </View>
          
        )}
      />
      

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{editingGoalId ? 'Editar Meta' : 'Adicionar Meta'}</Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Título da Meta"
            value={goalTitle}
            onChangeText={setGoalTitle}
          />

          <TextInput
            style={styles.modalInput}
            placeholder="Descrição da Meta"
            value={goalDescription}
            onChangeText={setGoalDescription}
          />

          <TextInput
            style={styles.modalInput}
            placeholder="Valor (R$)"
            value={goalValue}
            onChangeText={setGoalValue}
            keyboardType="numeric"
          />

          <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>Data de Início: {format(startDate, 'dd/MM/yyyy', { locale: ptBR })}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}

          <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>Data Limite: {format(endDate, 'dd/MM/yyyy', { locale: ptBR })}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}

          <View style={styles.modalButtons}>
            <Button title="Salvar" color="#E0939D" onPress={addGoal} />
            <Button title="Cancelar" color="#E0939D" onPress={() => setModalVisible(false)} />
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
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  goalContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 30,
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
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  goalDescription: {
    fontSize: 16,
    marginVertical: 5,
  },
  goalText: {
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#E0939D',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#E0939D',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  modalInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  dateButton: {
    width: '100%',
    height: 40,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: 'grey',
  },
});

