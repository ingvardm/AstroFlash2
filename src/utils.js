export const DD2DMS = dd => {
    const sign = Math.sign(dd)
    const abstract = Math.abs(dd)
    const d = Math.floor(abstract)
    const decM = (abstract - d) * 60
    const m = Math.floor(decM)
    const decS = (decM - m) * 60
    const s = decS.toFixed(2)

    return { sign, d, m, s }
}

const getDMSString = ({ d, m, s }) => `${d}º ${m}' ${s}"`

export const getLongitudeString = ({ sign, d, m, s }) =>
    `${sign < 0 ? 'W' : 'E'} ${getDMSString({ d, m, s })}`

export const getLatitudeString = ({ sign, d, m, s }) =>
    `${sign < 0 ? 'S' : 'N'} ${getDMSString({ d, m, s })}`