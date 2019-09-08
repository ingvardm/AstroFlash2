import AsyncStorage from '@react-native-community/async-storage'
import { Alert } from 'react-native'

export const set = (key, value) => {
    cache[key] = value
    AsyncStorage.setItem(key, JSON.stringify(value))
}

let cache = {}

export const get = async key => {
    if(cache[key]) return cache[key]

    try {
        const value = await AsyncStorage.getItem(key)
        const parsedValue = JSON.parse(value)

        cache[key] = parsedValue
        
        return parsedValue
    } catch (error) {
        if(__DEV__) console.error(JSON.parse(error))
        else Alert.alert('ERROR', 'Can\'t access storage')
        return null
    }
}

export const KEYS = {
    BRIGHTNESS: 'brightness'
}