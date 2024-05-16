import { StyleSheet } from 'react-native'
import COLORS from '../../../constants/colors'
export const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        top: 60,
    },
    scanText: {
        color: COLORS.black,
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        backgroundColor: COLORS.white,
        margin: 12,
        height: '60%',
        padding: 12,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewText: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },
    textScan: {
        color: COLORS.black,
        fontWeight: 'bold',
        fontSize: 18,
    },
    khungImg: { width: 350, height: 350 },
    viewTextThank: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    textThank: {
        color: COLORS.black,
        fontWeight: '500',
        fontSize: 15,
    },
    header: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#F0F0F0',
    },
    touchBack: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 13,
    },
    viewBackground: {
        backgroundColor: '#fec4b6',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: '50%',
        marginTop: 30,
        marginHorizontal: 25,
    },
    viewQr: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    showQr: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 25,
    },
    textName: {
        color: COLORS.black,
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 25,
    },
    viewProfile: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 25,
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: 25,
    },
    fullname: {
        color: COLORS.black,
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 25,
    },
    qr: {
        color: COLORS.black,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 50,
    },
    option: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 25,
        borderTopWidth: 1,
        borderTopColor: '#cccc',
        borderBottomRightRadius: 25,
        height: '10%',
        marginHorizontal: 25,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'relative',
    },
    scanImg: {
        height: 80,
        width: 80,
        borderRadius: 50,
        backgroundColor: '#fec4b6',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
    },
})
