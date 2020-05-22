//自然曲线模型方式
import {
    vSin,
    vCos,
    delay,
    Message
} from './common'
import { ziranquxianjibenjisuan, naturalCurveModule } from './naturalCurve'


async function naturalDesignDrill(logger) {
    //正弦值
    logger(Message('数据加载完成'))
    await delay(500)
    logger(Message('算法初始化...'))
    await delay(500)


    var Ck = 30
    const pi = 3.141592653
    var alp0 = 50, fai0 = 200
    var step = 10, maxL = 100
    var detL = 0

    var Kalp = 8 / Ck
    var Kfai = 0 / Ck

    // var dataAll = [['detaL m', 'α (°)', 'fai (°)', 'detaN m', 'detaE m', 'detaH m', 'detaS m', 'Kv (°)/30m', 'Kh (°)/30m', 'K (°)/30m', 'tao (°)/30m']], data3D = []
    var dataAll = []
    let data3D = []

    logger(Message('算法初始化完成'))
    await delay(500)
    let pross = 0
    logger(Message('迭代计算0%'))
    await delay(500)
    while (detL <= maxL) {


        //我的计算
        // var alp = 50 + Kalp * detL
        // var fai = 200 + Kfai * detL
        // var Kv = Kalp
        // var Kh = 0 / vSin(alp)
        // var K = (Kalp ** 2 + Kfai ** 2 * vSin(alp) ** 2)
        // var tao = Kfai * (1 + Kalp ** 2 / K ** 2) * vCos(alp)
        // var Ap = alp0 + fai0
        // var Aq = alp0 - fai0
        // var Kp = Kalp + Kfai
        // var Kq = Kalp - Kfai
        // var Fs = { Ap: {}, Aq: {}, alp0: {} }, Fc = { Ap: {}, Aq: {}, alp0: {} }

        // Fs.Ap.Kp = getFs(Ap, Kp, detL)
        // Fs.Aq.Kq = getFs(Aq, Kq, detL)
        // Fs.alp0.Kalp = getFs(alp0, Kalp, detL)

        // Fc.Ap.Kp = getFc(Ap, Kp, detL)
        // Fc.Aq.Kq = getFc(Aq, Kq, detL)
        // Fc.alp0.Kalp = getFc(alp0, Kalp, detL)

        // let detN = 1 / 2 * (Fc.Ap.Kp + Fc.Aq.Kq)
        // let detE = 1 / 2 * (Fs.Aq.Kq - Fs.Ap.Kp)

        // let detH = Fs.alp0.Kalp
        // let detS = Fc.alp0.Kalp
        //我的计算

        // data3D.push([detN, detE, -detH])
        // dataAll.push([detL, alp, fai, detN, detE, detH, detS, Kv * Ck, Kh * Ck, K * Ck, tao])

        //老师的公式
        //   北坐标  东坐标  detaH  井斜角 方位角    detaS
        let { NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(detL, alp0, fai0, Kalp, Kfai)//CL, INCrad, AZIrad, Build_rad, Turn_rad
        //老师的公式

        data3D.push([NSout, EWout, -TVDout])
        dataAll.push([detL, INCout, AZIout, NSout, EWout, TVDout, HLout, Kalp * Ck])
        detL += step
        if (detL > maxL) detL = maxL
        if (detL === maxL) break
        if (detL / maxL * 100 > pross + 10) {
            logger(Message(`迭代计算${pross}%`))
            await delay(500)
            pross = detL / maxL * 100
        }


    }
    logger(Message.success('计算完毕,处理数据...'))
    await delay(500)
    logger(Message.success('Echart数据处理完毕'))
    await delay(500)
    return ({ dataAll, data3D })

}



export {
    naturalDesignDrill
}