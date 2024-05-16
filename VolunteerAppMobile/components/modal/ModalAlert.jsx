import React, { useRef, useState } from 'react'
import { Modal, Text, View, TouchableOpacity } from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants'

const ModalAlert = ({ visible, onRequestClose }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            >
                <View
                    style={{
                        width: '100%',
                        height: '25%',
                        backgroundColor: '#fff',
                        borderRadius: 25,
                        padding:30,
                    }}
                >
                    <TouchableOpacity
                        onPress={onRequestClose}
                        style={{ position: 'absolute', top: 10, right: 10 }}
                    >
                        <Feather name="x" size={26} color={COLORS.black} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginTop: 25,
                        }}
                    >
                        <Ionicons name="calendar-outline" size={30} />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '700',
                                marginHorizontal: 15,
                            }}
                        >
                            Các hoạt động
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginTop: 18,
                        }}
                    >
                        <Ionicons name="newspaper-outline" size={30} />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '700',
                                marginHorizontal: 15,
                            }}
                        >
                            Các bài viết đang diễn ra
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginTop: 18,
                        }}
                    >
                        <Ionicons name="trash-bin-outline" size={30} />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '700',
                                marginHorizontal: 15,
                            }}
                        >
                            Các bài viết hết hạn
                        </Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{ backgroundColor: COLORS.primary }}
                        ></TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ModalAlert
