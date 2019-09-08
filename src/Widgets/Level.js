import React, { PureComponent } from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import { accelerometer } from 'react-native-sensors'
import { COLORS } from '../colors'

const SIZE = 24
const DOT_SIZE = 18
const accelerationLimit = 3

export default class Level extends PureComponent {
    constructor(props){
        super(props)

        this.state = {
            loaded: false,
        }

        this.handlePosition = new Animated.Value(0)
        this.visible = new Animated.Value(0)
        this.shouldBeVisible = false
        this.vertical = props.vertical
        this.accelerometerSubscription = null
        this.animating = false

        this.dotInterpolation = {
            inputRange:[-accelerationLimit, accelerationLimit],
            outputRange:[0, 0],
            extrapolate: 'clamp'
        }
    }

    componentDidMount(){
        this.start()
    }

    onLayout = ({ nativeEvent }) => {
        const { layout } = nativeEvent
        const { width, height } = layout

        const maxSize = ((this.vertical ? height : width) / 2 - DOT_SIZE) * (this.vertical ? 1 : -1)

        this.dotInterpolation = {
            inputRange:[-accelerationLimit, accelerationLimit],
            outputRange:[maxSize, -maxSize],
            extrapolate: 'clamp'
        }

        if(!this.state.loaded){
            this.setState({loaded: true})
        }
    }

    setVisible = visible => {
        this.shouldBeVisible = visible

        Animated.timing(
            this.visible,
            {
                toValue: Number(visible),
                duration: 500,
                useNativeDriver: true
            }
        ).start()
    }

    onAccelerometerUpdate = ({ x, y }) => {
        const value = this.vertical ? y : x
        const absValue = Math.abs(value)

        const isOverLimit = absValue > accelerationLimit * 2

        if(isOverLimit){
            if(this.shouldBeVisible) this.setVisible(false)
            return
        } else {
            if(!this.shouldBeVisible) this.setVisible(true)
        }

        if(this.animating){
            this.lastInQue = value
            return
        }

        this.animating = true

        Animated.timing(
            this.handlePosition,
            {
                toValue: value,
                duration: 100,
                useNativeDriver: true
            }
        ).start(_=> {
            this.animating = false
            if(this.lastInQue){
                this.onAccelerometerUpdate({
                    x: this.lastInQue,
                    y: this.lastInQue
                })
                this.lastInQue = null
            }
        })
    }

    stop = () => {
        if(!this.accelerometerSubscription) return
        this.accelerometerSubscription.unsubscribe()
        this.accelerometerSubscription = null
    }

    start = () => {
        if(this.accelerometerSubscription) this.stop()
        this.accelerometerSubscription = accelerometer.subscribe(this.onAccelerometerUpdate)
    }

    render(){
        const { loaded } = this.state
        if(!this.visible) return null
        const { style: additionalStyles } = this.props
        const handleTransform = { transform: [{
            [this.vertical ? 'translateY' : 'translateX']: this.handlePosition.interpolate(this.dotInterpolation)
        }]}

        return <Animated.View style={[styles.wrapper, additionalStyles, {opacity: this.visible}]} onLayout={this.onLayout}>
            <View style={styles.centerMark}>
                {loaded && <Animated.View style={[styles.dot, handleTransform]}/>}
            </View>
        </Animated.View>
    }
}

const styles = StyleSheet.create({
    wrapper: {
        width: SIZE,
        height: SIZE,
        alignItems: 'center',
        justifyContent: 'center'
    },
    centerMark: {
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        borderWidth: StyleSheet.hairlineWidth * 2,
        borderColor: COLORS.RED,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dot: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        backgroundColor: COLORS.RED,
    }
})