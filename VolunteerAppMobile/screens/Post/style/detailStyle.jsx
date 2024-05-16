import { StyleSheet, Dimensions } from 'react-native'
import COLORS from '../../../constants/colors'
import { getStatusBarHeight } from 'react-native-status-bar-height'
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
const statusBarHeight = getStatusBarHeight()
export const styles = StyleSheet.create({
    itemDonation: {
        height: 30,
        width: 30,
        marginRight: 15,
    },
    backBtn: {
        position: 'absolute',
        bottom:
            Platform.OS == 'ios'
                ? screenHeight - statusBarHeight - 50
                : screenHeight - 50,
        left: 20,
        borderRadius: 50,
        backgroundColor: '#cccc',
        zIndex: 3,
        padding: 4,
    },
    iconMember: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
    },
    viewIcon: {
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: '#DC143C',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    total: {
        fontSize: 14,
        color: '#696969',
        marginBottom: 4,
    },
    viewTime: {
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: '#20B2AA',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    textTime: {
        fontSize: 14,
        color: '#696969',
        marginBottom: 4,
    },
    viewMap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textMap: {
        fontSize: 13,
        color: '#696969',
        marginLeft: 4,
        marginRight: 15,
    },
    ownerView: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        marginTop: 5,
        paddingBottom: 15,
    },
    ownerName: {
        fontSize: 14,
        color: COLORS.primary,
        marginLeft: 4,
        marginRight: 15,
        fontWeight: 'bold',
    },
    joinedPeople: {
        fontSize: 14,
        color: COLORS.primary,
        marginLeft: 8,
        marginRight: 15,
        fontWeight: 'bold',
    },
    imgPost: {
        paddingVertical: 4,
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 8,
    },
})
