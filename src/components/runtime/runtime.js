function Message(msg) {
    if (typeof msg == 'string') msg = { message: msg }
    return {
        message: null,
        date: new Date(),
        type: 'Running',
        ...msg
    }
}

Message.err = (msg) => {
    return Message({
        message: msg,
        type: 'Failed'
    })
}
Message.success = (msg) => {
    return Message({
        message: msg,
        type: 'Successed'
    })
}

//正弦值

const vSin = (vAngle) => Math.round(Math.sin((vAngle * Math.PI / 180)) * 1000000) / 1000000;

//余弦值
const vCos = (vAngle) => Math.round(Math.cos((vAngle * Math.PI / 180)) * 1000000) / 1000000;

const delay = t => new Promise(resolve => {
    setTimeout(resolve, t)
})








export {
    naturalCurveModule
}