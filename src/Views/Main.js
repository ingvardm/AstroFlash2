import React, { PureComponent } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import Clock from '../Widgets/Clock'
import Location from '../Widgets/Location'
import Compass from '../Widgets/Compass'
import Level from '../Widgets/Level'
import Flashlight from '../Widgets/Flashlight'
import { setUpdateIntervalForType, SensorTypes } from 'react-native-sensors'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

setUpdateIntervalForType(SensorTypes.accelerometer, 100);

export default class Main extends PureComponent {
    render(){
        return <View style={styles.container}>
            <Clock/>
            <Location/>
            <View style={styles.bottomSection}>
                <Compass/>
            </View>
            <Flashlight/>
            {/* <Level style={[styles.levelIndicator, styles.verticalLevelIndicator, styles.leftLevelIndicator]} vertical/> */}
            <Level style={[styles.levelIndicator, styles.verticalLevelIndicator, styles.rightLevelIndicator]} vertical/>
            {/* <Level style={[styles.levelIndicator, styles.horizontalLevelIndicator, styles.topLevelIndicator]}/> */}
            <Level style={[styles.levelIndicator, styles.horizontalLevelIndicator, styles.bottomLevelIndicator]}/>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 24
    },
    levelIndicator: {
        position: 'absolute',
    },
    verticalLevelIndicator: {
        height: screenHeight,
    },
    horizontalLevelIndicator: {
        width: screenWidth,
    },
    bottomLevelIndicator: {
        bottom: 0,
    },
    topLevelIndicator: {
        top: 0
    },
    rightLevelIndicator: {
        right: 0
    },
    leftLevelIndicator: {
        left: 0
    },
    bottomSection: {
        flex: 1,
        justifyContent: 'flex-end'
    }
})
