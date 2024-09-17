import {StyleSheet,Text,View,Image,FlatList,StatusBar,ScrollView} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import Header from '../constants/Header';
import Balance from '../constants/Balance';
import Movements from '../constants/Movements';
import Actions from '../constants/Actions';

//Home

export default function Index(){

    const navigation = useNavigation();
    const [transactions, setTransactions] = useState([]);

    const route = useRoute();
    //const { total } = route.params;

    useEffect(() => {
        if (route.params?.total) {
          setTotal(route.params.total);
        }
      }, [route.params?.total]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@transactions');
      if (jsonValue != null) {
        setTransactions(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log('Erro ao carregar as transações.');
    }
  };

    return(
        <View style={styles.container}>

        <StatusBar
        barStyle="light-content" 
        backgroundColor="#E0939D" 
        translucent={false} 
         />
            <Header/>
            
            <Balance />

            <Actions/>

            <Text style ={styles.title}>Últimas Movimentações</Text>
          
            <FlatList
                style={styles.list}
                data={transactions.slice(-5).reverse()}
                keyExtractor={(item)=>item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({item})=><Movements data={item}/>}
                
            />

        </View>
        
    );
}
    const styles = StyleSheet.create({
        container:{
            flex:1,
            backgroundColor:'#fff',
        },

        title:{
            fontSize:19,
            color:'grey',
            textAlign:'center',
            margin:14,
            fontFamily: 'Roboto'
        },
        list:{
            marginStart:14,
            marginEnd:14,

        }
    })