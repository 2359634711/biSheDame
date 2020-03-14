function Message(msg){
    if(typeof msg == 'string') msg = {message: msg}
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



function calculate(logger) {
    //正弦值
    return new Promise((resolve, reject) => {
        logger(Message('数据加载完成'))
        logger(Message('算法初始化...'))

        var vSin = (vAngle) => Math.round(Math.sin((vAngle * Math.PI / 180)) * 1000000) / 1000000;

        //余弦值
        var vCos = (vAngle) => Math.round(Math.cos((vAngle * Math.PI / 180)) * 1000000) / 1000000;
    
    
        var Ck = 30
        const pi = 3.141592653
        var alp0 = 50, fai0 = 200
        var step = 10, maxL = 100
        var detL = 0
    
        var Kalp = 8 / Ck
        var Kfai = 0 / Ck
    
    
        function getFs(beta, X) {
            return 180 / pi * (1 / X) * (vSin(beta + X * detL) - vSin(beta))
        }
        function getFc(beta, X) {
            return 180 / pi * (1 / X) * (vCos(beta) - vCos(beta + X * detL))
        }
    
        var dataAll = [['detaL m', 'α (°)', 'fai (°)', 'detaN m', 'detaE m', 'detaH m', 'detaS m', 'Kv (°)/30m', 'Kh (°)/30m', 'K (°)/30m', 'tao (°)/30m']], data3D = []
        logger(Message('算法初始化完成'))
    
        let pross = 0
        logger(Message('迭代计算0%'))
        while (detL <= maxL) {
            var alp = 50 + Kalp * detL
            var fai = 200 + Kfai * detL
            var Kv = Kalp
            var Kh = 0 / vSin(alp)
            var K = (Kalp ** 2 + Kfai ** 2 * vSin(alp) ** 2)
            var tao = Kfai * (1 + Kalp ** 2 / K ** 2) * vCos(alp)
            var Ap = alp0 + fai0
            var Aq = alp0 - fai0
            var Kp = Kalp + Kfai
            var Kq = Kalp - Kfai
            var Fs = { Ap: {}, Aq: {}, alp0: {} }, Fc = { Ap: {}, Aq: {}, alp0: {} }
    
            Fs.Ap.Kp = getFs(Ap, Kp)
            Fs.Aq.Kq = getFs(Aq, Kq)
            Fs.alp0.Kalp = getFs(alp0, Kalp)
    
            Fc.Ap.Kp = getFc(Ap, Kp)
            Fc.Aq.Kq = getFc(Aq, Kq)
            Fc.alp0.Kalp = getFc(alp0, Kalp)
    
            let detN = 1 / 2 * (Fc.Ap.Kp + Fc.Aq.Kq)
            let detE = 1 / 2 * (Fs.Aq.Kq - Fs.Ap.Kp)
            let detH = Fs.alp0.Kalp
            let detS = Fc.alp0.Kalp
    
            data3D.push([detN, detE, -detH])
            dataAll.push([detL, alp, fai, detN, detE, detH, detS, Kv * Ck, Kh * Ck, K * Ck, tao])
            detL += step
            if (detL > maxL) detL = maxL
            if (detL === maxL) break
            if(detL / maxL * 100 > pross + 10){
                logger(Message(`迭代计算${pross}%`))
                pross = detL / maxL * 100
            }
        }
        logger(Message.success('计算完毕'))


        let option = {
            tooltip: {},
            backgroundColor: '#fff',
            visualMap: {
                show: false,
                dimension: 2,
                min: 0,
                max: 30, //?
                inRange: {
                    color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                }
            },
            xAxis3D: {
                type: 'value'
            },
            yAxis3D: {
                type: 'value'
            },
            zAxis3D: {
                type: 'value'
            },
            grid3D: {
                viewControl: {
                    projection: 'orthographic'
                }
            },
            series: [{
                type: 'line3D',
                data: data3D,
                lineStyle: {
                    width: 4
                }
            }]
        };



        logger(Message.success('Echart数据处理完毕'))

        resolve({dataAll, data3D, option})
    })
    

}



// var myChart = echarts.init(document.getElementById('main'))

// option = {
//     tooltip: {},
//     backgroundColor: '#fff',
//     visualMap: {
//         show: false,
//         dimension: 2,
//         min: 0,
//         max: 30, //?
//         inRange: {
//             color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
//         }
//     },
//     xAxis3D: {
//         type: 'value'
//     },
//     yAxis3D: {
//         type: 'value'
//     },
//     zAxis3D: {
//         type: 'value'
//     },
//     grid3D: {
//         viewControl: {
//             projection: 'orthographic'
//         }
//     },
//     series: [{
//         type: 'line3D',
//         data: data3D,
//         lineStyle: {
//             width: 4
//         }
//     }]
// };

// myChart.setOption(option)




export default calculate