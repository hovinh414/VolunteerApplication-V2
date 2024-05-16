import { StyleSheet } from 'react-native';
import COLORS from '../../../constants/colors';
export const styles = StyleSheet.create({
    post: {
        width: '100%',
        marginTop: 50,
        marginHorizontal: 10,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

    }
    ,
    profile: {
        display: 'flex',
        flexDirection: 'row'
    }
    ,

    profile_img: {
        height: 70,
        width: 70,
        borderRadius: 50,
        margin: 10
    },

    profile_details: {
        height: 70,
        paddingTop: 24,
        display: 'flex',
        justifyContent: 'space-evenly',
    },
    author: {
        // fontFamily: Roboto_900Black,
        fontWeight: '600',
        fontSize: 20
    },
    checkin: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 7
    },
    checkinText: {
        fontWeight: '400',
        fontSize: 14,
        fontStyle: 'italic',
        marginRight:150,
    }
    ,
    checkinIcon: {
        width: 22,
        height: 22,
        opacity: 0.7,
        marginRight:5,
    },
    content: {
        flexDirection:'row'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdown: {
        flex: 1,
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    button: {
        marginHorizontal: 16,
    },
    content_detail: {
        height: 130,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: COLORS.primary,

    },
    headerInput: {
        paddingVertical: 10,
        marginHorizontal: 10,
        fontSize: 18,
        // fontWeight: '500'
    },
    address: {
        width: '95%',
        marginHorizontal: 10,
        paddingHorizontal: 10,
        height: 50,
        justifyContent: 'center',
        fontSize: 16,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    people: {
        height: 35,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: 'white',
        shadowColor: '#c5c5c5',
        shadowOpacity: 1,
        width: 300,
        borderRadius: 5
    },
    addPicture: {
        width: 60,
        height: 60,
        borderRadius: 5,
    },
    address_people: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
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
        marginHorizontal: 10,
        paddingHorizontal: 10,
        height: 50,
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1.5,
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
        shadowOpacity: 0.75,
        shadowRadius: 4,
        elevation: 5,
    },
});