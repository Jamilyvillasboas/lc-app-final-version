import {StyleSheet,Text,View,Image,TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LogoLC from '../../../assets/logolc.png';


export default function Header(){
     return(  
        <View style={styles.container}> 

        <LinearGradient
        colors={['rgb(224, 147, 157)','rgb(251, 212, 212)']}
        style={styles.headerGradient}>
        <View style={styles.row1}>
        <Image style={styles.imgProfile} source={LogoLC} />
        <Text style={styles.txtWelcome}>Laços & Cia</Text>
        </View>              
        </LinearGradient> 
        </View>

    );
}

const styles = StyleSheet.create( {
    container:{
        height:150,
        alignItems:'center',
        
    },
    headerGradient:{
        flex:1,
        width:'100%',
        height:'30%',
        padding: 20,
    
          borderBottomLeftRadius: 25,
          borderBottomRightRadius:25
    },
    imgProfile:{
        marginTop:15,
        width:50,
        height:50,
        borderRadius:10,
    },
    row1:{
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',

    },
    txtWelcome:{
        marginTop:15,
        color:'white',
        fontSize:24,
        textAlign:'center',
        fontFamily:'Roboto'
        
    },
});