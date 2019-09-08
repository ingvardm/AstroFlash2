import KeepAwake from 'react-native-keep-awake'
import { AppState } from 'react-native'

let lastAppState = AppState.currentState

export const init = () => {
    if(lastAppState == 'active') KeepAwake.activate()
    AppState.addEventListener('change', handleAppStateChange)
}

function handleAppStateChange(state){
    if(lastAppState == state) return

    if(state == 'active'){
        KeepAwake.activate()
    } else {
        KeepAwake.deactivate()
    }

    lastAppState = state
}

export const destroy = () => {
    AppState.removeEventListener('change', handleAppStateChange)
    KeepAwake.deactivate()
}