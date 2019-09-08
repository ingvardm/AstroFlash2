import React, { PureComponent } from 'react'
import { View } from 'react-native'
import moment from 'moment'
import { LabelBody } from '../Components/Label'

const SECOND = 1000

const initialState = {
    date: '',
    time: '',
    tz: ''
}

export default class Clock extends PureComponent {
    state = {...initialState}
    timer = null

    componentDidMount(){
        this.start()
    }

    tick = () => {
        const [date, time, tz] = moment().format('DD/MM/YY HH:mm:ss Z').split(' ')

        this.setState({ date, time, tz })
    }

    startTicker = () => {
        this.timer = setInterval(this.tick, SECOND)
    }

    stopTicker = () => {
        if(!this.timer) return
        clearInterval(this.timer)
        this.timer = null
    }

    start = () => {
        const timestamp = new Date().getTime()
        const timeToNextSecondMS = SECOND - (timestamp % SECOND)

        if(this.timer){
            this.stop()
        }

        setTimeout(this.startTicker, timeToNextSecondMS)
        this.tick()
    }

    stop = () => {
        this.stopTicker()
        this.setState({...initialState})
    }

    render(){
        const { date, time, tz } = this.state

        return <View>
            <LabelBody>{date}</LabelBody>
            <LabelBody>{time} {tz}</LabelBody>
        </View>
    }
}