import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from "@expo/vector-icons";

const CustomInputPassword = ({ value, placeholder, keyboardType, secureTextEntry, onChangeText, error, errorMessage, onPress, isPasswordShow }) => {
    return (
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
                    }} />
                <TouchableOpacity
                    onPress={onPress}
                    style={{
                        position: "absolute",
                        right: 12
                    }}
                >
                    {
                        isPasswordShow == true ? (
                            <Ionicons name="eye-off" size={24} color={COLORS.black} />
                        ) : (
                            <Ionicons name="eye" size={24} color={COLORS.black} />
                        )
                    }

                </TouchableOpacity>
            </View>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({

    errorMessage: {
        paddingTop: 4,
        marginHorizontal: 5,
        color: COLORS.primary
    }
});
export default CustomInputPassword;