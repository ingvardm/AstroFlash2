import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, TouchableNativeFeedback } from 'react-native'
import { getUserLocation } from '../services/location'
import AsyncStorage from '@react-native-community/async-storage'
import { DD2DMS, getLatitudeString, getLongitudeString } from '../utils'
import { LabelBody } from '../Components/Label'

export default class Location extends PureComponent {
    state = {
        coords: {}
    }

    componentDidMount(){
        AsyncStorage.getItem('coords')
            .then(coords => {
                if(coords){
                    this.setState({coords: JSON.parse(coords)})
                }
            })
    }

    getLocation = async () => {
        const location = await getUserLocation();
        if(location){
            const { coords } = location
            this.setState({coords})
            AsyncStorage.setItem('coords', JSON.stringify(coords))
        }
    }

    render(){
        const { latitude, longitude } = this.state.coords
        const latitudeString = getLatitudeString(DD2DMS(latitude))
        const longitudeString = getLongitudeString(DD2DMS(longitude))

        return <View>
            {latitude && <LabelBody>{latitudeString}</LabelBody>}
            {longitude && <LabelBody>{longitudeString}</LabelBody>}
            <TouchableNativeFeedback onPress={this.getLocation}>
                <LabelBody>
                    Update location
                </LabelBody>
            </TouchableNativeFeedback>
        </View>
    }
}
