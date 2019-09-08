import React, { PureComponent } from 'react'
import { StyleSheet, View, PanResponder } from 'react-native'
import { accelerometer } from 'react-native-sensors'
import SystemSetting from 'react-native-system-setting'
import * as storage from '../services/storage'
import { COLORS } from '../colors'

export default class Flashlight extends PureComponent {
    state = {
        visible: false
    }

    originalBrightnessLevel = 0
    customBrightnessLevel = 0.5
    accelerometerSubscription = null
    lastDeltaY = 0
    showDelay = 200
    showTimer = null
    phoneFlipped = false

    panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,

        onPanResponderMove: (evt, gestureState) => {
            if(gestureState.dy < this.lastDeltaY - 10){
                this.customBrightnessLevel += 0.03
            } else if(gestureState.dy > this.lastDeltaY + 10){
                this.customBrightnessLevel -= 0.03
            }
            this.lastDeltaY = gestureState.dy
            if(!this.buisy){
                SystemSetting.setBrightnessForce(this.customBrightnessLevel)
                    .then(() => {
                        this.buisy = false
                    })
            }
        },
        onPanResponderTerminationRequest: () => true,
        onPanResponderRelease: () => {
            storage.set(storage.KEYS.BRIGHTNESS, this.customBrightnessLevel)
        },
        onShouldBlockNativeResponder: () => true,
    })

    componentDidMount() {
        this.start()
        storage.get(storage.KEYS.BRIGHTNESS)
            .then(brightness => this.customBrightnessLevel = brightness || this.customBrightnessLevel)
    }

    stop = () => {
        if (!this.accelerometerSubscription) return
        this.accelerometerSubscription.unsubscribe()
        this.accelerometerSubscription = null
        this.hide()
    }

    start = () => {
        SystemSetting.saveBrightness()
        if (this.accelerometerSubscription) this.stop()
        this.accelerometerSubscription = accelerometer.subscribe(this.onAccelerometerUpdate)
    }

    onAccelerometerUpdate = ({ z }) => {
        const phoneFlipped = z < -5

        if (phoneFlipped) {
            if(!this.phoneFlipped) this.show()
        } else {
            if(this.phoneFlipped) this.hide()
        }

        this.phoneFlipped = phoneFlipped
    }

    show = () => {
        if(this.showTimer){
            clearTimeout(this.showTimer)
        }
        this.showTimer = setTimeout(() => {
            SystemSetting.saveBrightness()
            SystemSetting.setBrightnessForce(this.customBrightnessLevel).then(success => {
                !success && Alert.alert('Permission Denyed', 'You have no permission changing settings',[
                    {'text': 'Ok', style: 'cancel'},
                    {'text': 'Open Setting', onPress:()=>SystemSetting.grantWriteSettingPremission()}
                ])
            })
            this.setState({ visible: true })
            this.showTimer = null
        }, this.showDelay)
    }

    hide = () => {
        if(this.showTimer){
            clearTimeout(this.showTimer)
            this.showTimer = null
        }
        SystemSetting.restoreBrightness()
        this.setState({ visible: false })
    }

    render() {
        const { visible } = this.state

        if (!visible) return null
        return <View style={styles.flashlight} {...this.panResponder.panHandlers}/>
    }
}

const styles = StyleSheet.create({
    flashlight: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
        backgroundColor: COLORS.FLASHLIGHT_RED
    }
})
