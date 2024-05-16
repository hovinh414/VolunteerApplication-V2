import {StyleSheet} from 'react-native';
import COLOR from '../../constants/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        marginVertical: 0,

    },
    form:{
        paddingBottom: 30,
    },

    textHeader: {
        marginTop: 100,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    label : {
        marginVertical: 35,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        color: COLOR.white,
    },
    textDesc: {
        fontSize: 15,
        textAlign: 'center'
    },
    titleOtp: {
        flex: 1,
        marginTop: 100,
        color: COLOR.white,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center'  
    },
    containerInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cellView: {
        flex: 1,
        paddingVertical: 5,
        height: 50,
        width: 50,
        margin: 10,
        justifyContent: 'center',
        alignContent: 'center',
        borderBottomWidth: 1.5,
        marginTop: 50,
        marginBottom: 20
    },
    cellText: {
        textAlign: 'center',
        fontSize:30, 
    }
    ,
    backButton: {
        flex: 0.7,
        flexDirection: 'row',
    }
    ,
    arrowReturn: {
        width: 20,
        height: 20,
        marginTop: 50
    },

    loginOption: {
        flex:1,
        flexWrap: 'wrap',  
        marginHorizontal: 45,
    },
    containerAvoiddingView: {
        flex: 1,
        alignItems: 'center',
        padding: 10
    }
    ,
    oauth: {
        width: 40,
        height: 40,
        marginHorizontal: 15,
    },
    type: {
        color: 'red'
    }
    ,
    footer : {
        marginTop: 190,
        alignItems: 'center',
        justifyContent: 'center',   
    },
    footerText: {
        color: COLOR.white,
        fontSize: 15,
        paddingVertical: 6,
    },
    login: {
        flex: 1,
        color: COLOR.primary,
        fontWeight: 'bold',
    }
    ,
    mainWrapper: {
        backgroundColor: '#rgb(29,182,28)',
        borderRadius: 12,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        marginVertical:5
    }
    
});