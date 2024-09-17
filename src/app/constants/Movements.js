import React ,{ useState }from 'react';
import{View,Text,StyleSheet,TouchableOpacity,ScrollView} from 'react-native';

export default function Movements({data}) {

    const [showValue,setShowValue] = useState(false);
    
 return (
    <ScrollView Vertical={true} showsVerticalScrollIndicator={false}>
    <TouchableOpacity style ={styles.container} onPress={()=> setShowValue(!showValue)}>
    <Text style={styles.date}>{data.date}</Text>
    <View style={styles.content}>
        <Text style={styles.label}>{data.description}</Text>
        { showValue ? (
          <Text style={styles.value}>
            
          {data.amount >= 0 ? '+' : '-'}R${Math.abs(data.amount).toFixed(2)}
          </Text>  
        ):(
            <View style={styles.skeleton}>
            </View>
        )}
    </View>
   </TouchableOpacity>
   </ScrollView>
 );
}

const styles = StyleSheet.create({
    container:{

        flex:0.32,
        marginBottom:10,
        
        borderRadius:30,
        padding:15,

        backgroundColor: '#f7f7f7',
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
    content:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop: 2,
        marginBottom: 2,
    },
    date:{
        color:'#E0939D',
        fontWeight: 'bold',
    },
    label:{
        fontSize:16,
    },
    value:{
        fontSize:16,
        color:'#E0939D',
        fontWeight:'bold'
    },
    skeleton:{
        marginTop:6,
        width:80,
        height:10,
        backgroundColor:'#E0939D',
        borderRadius:8,
        

       
    }
})