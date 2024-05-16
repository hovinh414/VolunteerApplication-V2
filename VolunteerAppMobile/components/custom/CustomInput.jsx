import React from 'react';
import {View,Text, TextInput, StyleSheet, Image } from 'react-native';
import {COLORS, SIZES} from '../../constants/theme';

const CustomInput = ({value, placeholder, keyboardType, secureTextEntry, onChangeText, error, errorMessage}) => {
    return(
        <React.Fragment>
        <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: error ? COLORS.primary : '#A9A9A9',
                        borderWidth: 1,
                        borderRadius: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
            <TextInput
            
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={'#999'}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                style={{
                    width: "100%"
                }}/>
        </View>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    
    errorMessage: {
        paddingTop:4,
        marginHorizontal: 5,
        color: COLORS.primary
    }
});
export default CustomInput;