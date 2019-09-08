import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, Animated, Dimensions, Image } from 'react-native'
import CompassHeading from 'react-native-compass-heading'

const UPDATE_TRESHOLD = 1

const rotationInterpolation = {
    inputRange:[0, 359.99],
    outputRange:['0deg', '-359.99deg']
}

export default class Compass extends PureComponent {
    heading = new Animated.Value(0)
    animating = false

    componentDidMount(){
        this.start()
    }

    lastInQue = null
    rawHeading = 0

    handleHeadingUpdate = heading => {
        if(this.animating){
            this.lastInQue = heading
            return
        }
        this.animating = true

        const absHeading = Math.abs(heading)
        const absRawHeading = Math.abs(this.rawHeading)
        const delta = Math.min(absHeading, absRawHeading) / Math.max(absHeading, absRawHeading)
        const duration = this.lastDuration || 100 * delta

        setTimeout(() => {
            this.animating = false
            if(this.lastInQue){
                this.handleHeadingUpdate(this.lastInQue)
                this.lastInQue = null
            } else {
                this.lastDuration = null
            }
        }, duration * 0.5)

        this.lastDuration = duration

        Animated.timing(
            this.heading,
            {
                toValue: heading,
                duration,
                useNativeDriver: true
            }
        ).start(_=> {
            this.rawHeading = heading
            this.animating = false

            if(this.lastInQue){
                this.handleHeadingUpdate(this.lastInQue)
                this.lastInQue = null
            } else {
                this.lastDuration = null
            }
        })
    }

    start = () => {
        CompassHeading.start(UPDATE_TRESHOLD, this.handleHeadingUpdate)
    }

    stop = () => {
        CompassHeading.stop();
    }

    render(){
        const transform = {transform: [{ rotate: this.heading.interpolate(rotationInterpolation) }]}

        return <View style={styles.container}>
            <Animated.Image
                source={require('../images/compass/compass.png')}
                style={[styles.image, transform]}/>
        </View>
    }
}

const CROSSHAIR_SIZE = 280

const styles = StyleSheet.create({
    container: {
        marginVertical: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: CROSSHAIR_SIZE,
        height: CROSSHAIR_SIZE
    },
})
