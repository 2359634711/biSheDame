//自然曲线模型方式
import {
    vSin,
    vCos,
    delay,
    Message,
    Point
} from './common'

function getFs(beta, X, detL) {
    return 180 / Math.PI * (1 / X) * (vSin(beta + X * detL) - vSin(beta))
}
function getFc(beta, X, detL) {
    return 180 / Math.PI * (1 / X) * (vCos(beta) - vCos(beta + X * detL))
}

// const Fs = getFs
// const Fc = getFc

// function Fs(beta, x, CL) {
//     let y;
//     y = (vSin(beta + x * CL) - vSin(beta)) / x;
//     return y;
// }

// function Fc(beta, x, CL) {
//     let y;
//     y = (vCos(beta) - vCos(beta + x * CL)) / x;
//     return y;
// }
async function naturalCurveModule(logger, options) {
    // const pi = 3.141592653
    var Ck = 30

    let {
        alp0,
        fai0,
        step,
        detL,
        Kalp,
        Kfai,
        maxL,
    } = options


    alp0 = alp0 || 50
    fai0 = fai0 || 200
    step = step || 10
    maxL = maxL || 100
    detL = detL || 0
    Kalp = Kalp || 8 / Ck
    Kfai = Kfai || 0 / Ck



    //正弦值
    logger(Message('数据加载完成'))
    await delay(500)
    logger(Message('算法初始化...'))
    await delay(500)








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

        data3D.push([NSout, EWout, -TVDout, Math.sqrt(NSout ** 2 + EWout ** 2)])
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


function naturalCurveModule3D(options) {
    // const pi = 3.141592653
    var Ck = 30
    let {
        N1,
        E1,
        H1,
        S1,
        alp0,
        fai0,
        step,
        detL,
        Kalp,
        Kfai,
        maxL,//段长度
        startL//起始井深
    } = options
    alp0 = alp0 || 50
    fai0 = fai0 || 200
    step = step || 10
    maxL = maxL || 100
    detL = detL || 0
    Kalp = Kalp || (8 / Ck)
    Kfai = Kfai || (0 / Ck)
    N1 = N1 || 0
    S1 = S1 || 0
    E1 = E1 || 0
    H1 = H1 || 0
    startL = startL || 0
    // var dataAll = [['detaL m', 'α (°)', 'fai (°)', 'detaN m', 'detaE m', 'detaH m', 'detaS m', 'Kv (°)/30m', 'Kh (°)/30m', 'K (°)/30m', 'tao (°)/30m']], data3D = []
    var dataAll = []
    let data3D = []
    let pross = 0
    while (detL <= maxL) {
        //老师的公式
        //   北坐标  东坐标  detaH  井斜角 方位角    detaS
        let { NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(detL, alp0, fai0, Kalp, Kfai)//CL, INCrad, AZIrad, Build_rad, Turn_rad
        //老师的公式

        // dataAll.push({ N, E, H, alph, fai, s })

        data3D.push([N1 + NSout, E1 + EWout, -(TVDout + H1), Math.sqrt((N1 + NSout) ** 2 + (E1 + EWout) ** 2)])
        dataAll.push([startL + detL, INCout, AZIout, N1 + NSout, E1 + EWout, H1 + TVDout, S1 + HLout, Kalp * Ck])
        if (detL === maxL) break
        detL += step
        if (detL > maxL) detL = maxL


    }
    return ({ dataAll, data3D })

}


/**
 * 
 * @param {*段长} CL 
 * @param {*井斜角} INCrad 
 * @param {*方位角} AZIrad 
 * @param {*Kalph} Build_rad 
 * @param {*Kfai} Turn_rad 
 */
function ziranquxianjibenjisuan(CL, INCrad, AZIrad, Build_rad, Turn_rad) {
    let NSout, EWout, TVDout, INCout, AZIout, HLout
    INCout = INCrad + CL * Build_rad;
    //方位
    AZIout = AZIrad + CL * Turn_rad;
    // while (AZIout < 0) {
    //     AZIout = AZIout + Math.PI * 2;
    // }
    // while (AZIout >= Math.PI * 2) {
    //     AZIout = AZIout - Math.PI * 2;
    // }
    let kp = Build_rad + Turn_rad, kq = Build_rad - Turn_rad;
    let Ap = INCrad + AZIrad, Aq = INCrad - AZIrad;

    if (Math.abs(kp) <= 0.00001) {
        if (Math.abs(kq) <= 0.00001) {
            NSout = 0 + CL * vSin(INCrad) * vCos(AZIrad);
            EWout = 0 + CL * vSin(INCrad) * vSin(AZIrad);
        }
        else {
            NSout = 0 + (CL * vSin(Ap) + getFc(Aq, kq, CL)) / 2;
            EWout = 0 + (getFs(Aq, kq, CL) - CL * vCos(Ap)) / 2;
        }

    }
    else {
        if (Math.abs(kq) <= 0.00001) {
            NSout = 0 + (CL * vSin(Aq) + getFc(Ap, kp, CL)) / 2;
            EWout = 0 + (CL * vCos(Aq) - getFs(Ap, kp, CL)) / 2;
        }
        else {
            NSout = 0 + (getFc(Ap, kp, CL) + getFc(Aq, kq, CL)) / 2;
            EWout = 0 + (getFs(Aq, kq, CL) - getFs(Ap, kp, CL)) / 2;
        }
    }

    if (Math.abs(Build_rad) <= 0.00001) {
        TVDout = 0 + (CL * vCos(INCrad)) * 180 / Math.PI;
        HLout = 0 + (CL * vSin(INCrad)) * 180 / Math.PI;
    }
    else {
        //
        TVDout = 0 + ((-vSin(INCrad) + vSin(INCrad + Build_rad * CL)) / Build_rad) * 180 / Math.PI;
        //
        HLout = 0 + ((vCos(INCrad) - vCos(INCrad + Build_rad * CL)) / Build_rad) * 180 / Math.PI;
    }
    //          北坐标  东坐标  detaH  井斜角 方位角    detaS
    return { NSout, EWout, TVDout, INCout, AZIout, HLout }

}


export {
    naturalCurveModule,
    ziranquxianjibenjisuan,
    naturalCurveModule3D
}