import React, { useRef, useState } from 'react'
import { Modal, Image, View, ActivityIndicator } from 'react-native'
import { COLORS } from '../../constants'
const ModalLoading = ({ visible, onRequestClose }) => {
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
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            >
                {visible ? (
                    <ActivityIndicator size="large" color={COLORS.white} />
                ) : null}
            </View>
        </Modal>
    )
}

export default ModalLoading
