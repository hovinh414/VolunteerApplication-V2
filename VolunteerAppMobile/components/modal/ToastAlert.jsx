import React, { useRef, useState } from 'react'
import { View, Text } from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import { COLORS } from '../../constants'
const ToastAlert = ({ visible, onRequestClose }) => {
    const toastConfig = {
        success: (props) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: '#379A4F',
                    backgroundColor: '#379A4F',
                    borderRadius: 12,
                    width: '90%',
                }}
                text1Style={{
                    color: '#fff',
                    fontSize: 18,
                }}
                text2Style={{
                    fontSize: 16,
                    color: '#fff',
                }}
                renderLeadingIcon={SuccessToast}
            />
        ),

        error: (props) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: '#FF0035',
                    backgroundColor: '#FF0035',
                    borderRadius: 12,
                }}
                text1Style={{
                    fontSize: 18,
                    color: '#fff',
                }}
                text2Style={{
                    fontSize: 16,
                    color: '#fff',
                }}
                renderLeadingIcon={ErrorToast}
            />
        ),
        warning: (props) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: '#FFE600',
                    backgroundColor: '#FFE600',
                    borderRadius: 12,
                }}
                text1Style={{
                    fontSize: 18,
                }}
                text2Style={{
                    fontSize: 16,
                    color: '#696969',
                }}
                renderLeadingIcon={WarningToast}
            />
        ),
        joinToast: ({ text1, text2, email }) => (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderLeftColor: '#379A4F',
                    backgroundColor: '#379A4F',
                    borderRadius: 12,
                    padding: 10,
                }}
            >
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 5,
                    }}
                >
                    <Ionicons
                        name="checkmark-circle-outline"
                        size={35}
                        color={'#fff'}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'column',
                        padding: 5,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '700',
                            color: '#fff',
                        }}
                    >
                        {text1}
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#fff',
                            marginTop: 5,
                            marginRight: 5,
                        }}
                    >
                        {text2}
                    </Text>
                </View>
            </View>
        ),
    }
    const WarningToast = () => {
        // Your component logic here

        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 12,
                }}
            >
                <Ionicons
                    name="alert-circle-outline"
                    size={35}
                    color={COLORS.black}
                />
            </View>
        )
    }
    const SuccessToast = () => {
        // Your component logic here

        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 12,
                }}
            >
                <Ionicons
                    name="checkmark-circle-outline"
                    size={35}
                    color={'#fff'}
                />
            </View>
        )
    }
    const ErrorToast = () => {
        // Your component logic here

        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 12,
                }}
            >
                <Ionicons
                    name="close-circle-outline"
                    size={35}
                    color={'#fff'}
                />
            </View>
        )
    }
    return (
        <View
            style={{
                zIndex: 4,
            }}
        >
            <Toast config={toastConfig} />
        </View>
    )
}

export default ToastAlert
