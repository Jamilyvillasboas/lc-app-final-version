import React from 'react';
import{View,Text,StyleSheet,TouchableOpacity,ScrollView} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

export default function Actions(){

    const { navigate } = useNavigation();
    
    return(
        <ScrollView style={styles.container} horizontal={true} showsHorizontalScrollIndicator={false}>

        
       <TouchableOpacity style={styles.actionButton}onPress={()=>{navigate('Estoque');}}>
            <View style={styles.areaButton}>
                <AntDesign name="tagso" size={26} color="#E0939D"></AntDesign>
            </View>
            <Text style={styles.labelButton}>Estoque</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}onPress={()=>{navigate('Vendas');}}>
       <View style={styles.areaButton}>
                <AntDesign name="pluscircleo" size={26} color="#E0939D"></AntDesign>
       </View>
       <Text style={styles.labelButton}>Registrar</Text>
       </TouchableOpacity>

       <TouchableOpacity style={styles.actionButton}onPress={()=>{navigate('Metas');}}>
            <View style={styles.areaButton}>
                <AntDesign name="checksquareo" size={26} color="#E0939D"></AntDesign>
            </View>
            <Text style={styles.labelButton}>Metas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}onPress={()=>{navigate('Entradas');}}>
            <View style={styles.areaButton}>
                <AntDesign name="upcircleo" size={26} color="#E0939D"></AntDesign>
            </View>
            <Text style={styles.labelButton}>Entradas</Text> 
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}onPress={()=>{navigate('Saídas');}}>
<View style={styles.areaButton}>
    <AntDesign name="downcircleo" size={26} color="#E0939D"></AntDesign>
</View>
<Text style={styles.labelButton}>Saídas</Text>
</TouchableOpacity> 

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:{
        maxHeight:100,
        marginBottom:15,
        marginTop:2,
        paddingEnd:14,
        paddingStart:14,
    },
    actionButton:{
        alignItems:'center',
        marginRight:32
    },
    areaButton:{
    backgroundColor:'#f7f7f7',
    height:60,
    width:60,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',

    },
    labelButton:{
        marginTop:4,
        textAlign:'center',
    
    }


})