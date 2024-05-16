import { MenuOption } from 'react-native-popup-menu'
import { Text } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { SimpleLineIcons } from '@expo/vector-icons'
import { EvilIcons } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'

export const MyActivity = ({ text, iconName, value }) => (
    <MenuOption
        onSelect={() => alert(`You clicked ${value}`)}
        customStyles={{
            optionWrapper: {
                flexDirection: 'row',
                alignItems: 'center',
                height:45,
                justifyContent: 'space-between',
            },
        }}
    >
        <Text>{text}</Text>
        <Feather name={iconName} size={24} color="black" />
    </MenuOption>
)

export const PostOngoing = ({ text, iconName, value }) => (
    <MenuOption
        onSelect={() => alert(`You clicked ${value}`)}
        customStyles={{
            optionWrapper: {
                flexDirection: 'row',
                alignItems: 'center',
                height:45,
                justifyContent: 'space-between',
            },
        }}
    >
        <Text>{text}</Text>
        <Feather name={iconName} size={24} color="black" />
    </MenuOption>
)


export const JoinActivity = ({ text, iconName, value }) => (
    <MenuOption
        onSelect={() => alert(`You clicked ${value}`)}
        customStyles={{
            optionWrapper: {
                flexDirection: 'row',
                alignItems: 'center',
                height:45,
                justifyContent: 'space-between',
            },
        }}
    >
        <Text>{text}</Text>
        <Feather name={iconName} size={24} color="black" />
    </MenuOption>
)
export const Question = ({ text, iconName, value }) => (
    <MenuOption
        onSelect={() => alert(`You clicked ${value}`)}
        customStyles={{
            optionWrapper: {
                flexDirection: 'row',
                alignItems: 'center',
                height:45,
                justifyContent: 'space-between',
            },
        }}
    >
        <Text>{text}</Text>
        <Feather name={iconName} size={24} color="black" />
    </MenuOption>
)
export const Follow = ({ text, iconName, onSelect }) => (
    <MenuOption
        onSelect={onSelect}
        customStyles={{
            optionWrapper: {
                flexDirection: 'row',
                height:45,
                alignItems: 'center',
                justifyContent: 'space-between',
            },
        }}
    >
        <Text>{text}</Text>
        <Feather name={iconName} size={24} color="black" />
    </MenuOption>
)
