import { View, Text, Image, Pressable, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import {COLORS} from '../../constants/theme';
import { Ionicons } from "@expo/vector-icons";
import { styles } from './SignupScreenStyle';
import { MaterialIcons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import Button from '../../components/custom/Button';

const Signup = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    paddingTop: 80,
                    paddingLeft: 20,
                    position: "absolute",
                    left: 0,
                }}
            >
                <MaterialIcons
                    name="keyboard-arrow-left"
                    size={30}
                    color={COLORS.black}
                />
            </TouchableOpacity>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ paddingBottom: 30 }}>
                    <Text style={styles.textHeader}>Chọn loại</Text>
                    <Text style={styles.textDesc}>Vui lòng chọn một trong hai</Text>
                </View>

                <Button
                    title="Tổ chức"
                    filled
                    style={{
                        backgroundColor:COLORS.primary,
                        marginTop: 18,
                        marginBottom: 4,
                    }}
                    onPress={() => navigation.navigate("SignupOrganisation")}
                />
                <Button
                    title="Cá nhân"
                    filled
                    style={{
                        backgroundColor:COLORS.primary,
                        marginTop: 18,
                        marginBottom: 4,
                    }}
                    onPress={() => navigation.navigate("Signup")}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: COLORS.grey,
                            marginHorizontal: 10
                        }}
                    />


                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>

                    </View>

                </View>
            </View>
        </SafeAreaView>
    )
}

export default Signup