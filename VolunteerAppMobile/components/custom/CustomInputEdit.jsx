import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import {
    Feather,
    Ionicons,
    FontAwesome,
    FontAwesome5,
} from '@expo/vector-icons'
const CustomInputEdit = ({ value, onPress, error, errorMessage }) => {
    return (
        <React.Fragment>
            <TouchableOpacity
            onPress={onPress}
             style={{
                width: "100%",
                height: 70,
                borderColor: error ? COLORS.primary : '#A9A9A9',
                borderWidth: 1,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 22
            }}>
                <Text

                    style={{
                        paddingRight:80,
                        width: "100%"
                    }}>{value}</Text>
                <TouchableOpacity
                   onPress={onPress}
                    style={{
                        position: "absolute",
                        right: 12
                    }}
                >
                    {
                        <Feather name="edit" size={20} color={COLORS.blue} />
                    }

                </TouchableOpacity>

            </TouchableOpacity>
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
export default CustomInputEdit;