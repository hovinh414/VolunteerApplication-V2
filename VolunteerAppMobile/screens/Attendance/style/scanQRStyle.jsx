import { StyleSheet } from 'react-native'
import COLORS from '../../../constants/colors'
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#F0F0F0',
    },
    backButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        top: 60,
    },
    backgroundColor: {
        backgroundColor: COLORS.white,
        margin: 12,
        height: '60%',
        padding: 12,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewTextScan: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },
    textScan: {
        color: COLORS.black,
        fontWeight: 'bold',
        fontSize: 18,
    },
})
