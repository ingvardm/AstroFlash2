import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { COLORS } from '../colors'

const Label = ({style: additionalStyles, ...props}) =>
    <Text
        {...props}
        style={[styles.default, additionalStyles]}/>


export const LabelBody = ({style: additionalStyles, ...props}) =>
    <Label
        {...props}
        style={[styles.body, additionalStyles]}
        maxFontSizeMultiplier={1.2}/>


const styles = StyleSheet.create({
    default: {
        color: COLORS.RED,
    },
    body: {
        fontSize: 32,
        lineHeight: 42,
    }
})