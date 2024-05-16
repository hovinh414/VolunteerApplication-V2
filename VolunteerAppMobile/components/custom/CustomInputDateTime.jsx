import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Pressable } from 'react-native';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import { COLORS, SIZES } from '../../constants/theme';
import { addDays, format, addYears } from 'date-fns';
import { da } from 'date-fns/locale';
const CustomInputDateTime = ({ onChangeText, _value }) => {
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const today = new Date();
    const startDate = getFormatedDate(
        today.setDate(today.getDate() + 1),
        "DD/MM/YYYY"
    );
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [startedDate, setStartedDate] = useState("12/12/2023");

    function handleChangeStartDate(propDate) {
        setStartedDate(propDate);
    }

    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker);
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : ""}
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#fff",
            }}
        >
            <View >
                <View>
                    <TouchableOpacity
                        style={styles.inputBtn}
                        onPress={handleOnPressStartDate}
                    >
                        <Text
                            style={{
                                flex: 1,
                                fontSize: 16,
                                marginLeft: 10,
                                paddingVertical: 13,
                                width: 29,
                                color: '#696969',
                            }}>{selectedStartDate}</Text>
                        <View style={styles.iconStyle}>
                            <Image
                                style={styles.icon}
                                source={require('../assets/icons8-calendar-64.png')} />
                        </View>
                    </TouchableOpacity>

                </View>

                {/* Create modal for date picker */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={openStartDatePicker}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <DatePicker
                                mode="calendar"
                                minimumDate={startDate}
                                selected={startedDate}
                                onDateChanged={handleChangeStartDate}
                                onSelectedChange={(date) => setSelectedStartDate(date)}
                                options={{
                                    backgroundColor: "#FFF",
                                    textHeaderColor: COLORS.primary,
                                    textDefaultColor: COLORS.black,
                                    selectedTextColor: COLORS.black,
                                    mainColor: COLORS.primary,
                                    textSecondaryColor: "#FFFFFF",
                                    borderColor: "rgba(122, 146, 165, 0.1)",
                                }}
                            />

                            <TouchableOpacity
                             onPress={handleOnPressStartDate}>
                                <Text style={{ color: COLORS.black }}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    textHeader: {
        fontSize: 36,
        marginVertical: 60,
        color: "#111",
    },
    textSubHeader: {
        fontSize: 25,
        color: "#111",
    },
    inputBtn: {
        flex: 1, flexDirection: 'row',
        alignItems: 'center',
        width: '40%',
        marginHorizontal: 10,
        paddingHorizontal: 10,
        height: 50,
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1.5,
        marginLeft: 30,
        borderColor: COLORS.primary,
    },
    centeredView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    iconStyle: {
    },
    icon: {
        width: 25,
        height: 25,
    },
    modalView: {
        margin: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        padding: 35,
        width: "90%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
export default CustomInputDateTime;