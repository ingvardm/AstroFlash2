import { PermissionsAndroid, Alert } from 'react-native'
import Geolocation from '@react-native-community/geolocation';

function _checkPermissionStatus(){
    return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
}

function _requestPermission(){
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )
}

function _getLocation() {
    return new Promise((resolve) => {
        Geolocation.getCurrentPosition(resolve)
    })
}

export const getUserLocation = async () => {
    try {
        const granted = await _checkPermissionStatus()

        if(granted){
            return _getLocation()
        }

        const permissionStatus = await _requestPermission()
        
        switch (permissionStatus) {
            case PermissionsAndroid.RESULTS.GRANTED:
                return _getLocation()
        
            case PermissionsAndroid.RESULTS.DENIED:
                if(alreadyAskedOnce) return null

            case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
                Alert.alert('Geolocation', 'Location permission was set to never ask again, please change it in Astro Flashlight 2 settings')
                return null
        }
    } catch (err) {
        Alert.alert('Geolocation', 'error while asking for location permission')
    }
}