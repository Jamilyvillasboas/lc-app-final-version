import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Balance() { 

    const navigation = useNavigation();
    const [showValue, setShowValue] = useState(false);
    const [total, setTotal] = useState(0);

    // Use useFocusEffect to fetch the total when the screen is focused
    useFocusEffect(
        React.useCallback(() => {
            const fetchTotal = async () => {
                try {
                    const jsonValue = await AsyncStorage.getItem('@transactions');
                    if (jsonValue != null) {
                        const transactions = JSON.parse(jsonValue);
                        const calculatedTotal = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
                        setTotal(calculatedTotal);
                    }
                } catch (e) {
                    Alert.alert('Erro ao carregar as transações.');
                }
            };

            fetchTotal();
        }, [])
    );

    return (
        <TouchableOpacity style={styles.container} onPress={() => setShowValue(!showValue)}>
            <View style={{ width: '100%', alignItems: 'center' }} />
            <View style={styles.ResumoSaldo}>
                <Text style={{ color: 'grey', fontSize: 16 }}>Seu saldo Total</Text>
                <View style={styles.cifraoDoLado}>
                    <Text style={styles.currencySymbol}>R$</Text>
                    { showValue ? (
                        <Text style={styles.balance}>{total.toFixed(2)}</Text>
                    ) : (
                        <View style={styles.skeleton} />
                    )}
                </View>
            </View> 
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        zIndex: 99,
    },
    currencySymbol: {
        paddingTop: 10,
        color: '#E0939D',
        fontSize: 30,
    },
    cifraoDoLado: {
        flexDirection: 'row',
    },
    ResumoSaldo: {
        backgroundColor: '#f7f7f7',
        width: '80%',
        top: -50,
        borderRadius: 30,
        padding: 20,
    },
    balance: {
        marginLeft: 5,
        paddingTop: 10,
        color: '#E0939D',
        fontSize: 30,
    },
    skeleton: {
        marginLeft: 10,
        marginTop: 30,
        width: 100,
        backgroundColor: '#E0939D',
        borderRadius: 10,
        height: 10,
    },
});
