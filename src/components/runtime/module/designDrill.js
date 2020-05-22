//直增稳降稳定向井模型 数学计算方式
import {
    vSin,
    vCos,
    delay,
    Message,
    vArcCos,
    vArcSin,
    vTan,
    Point3D
} from './common'

function Point(x, y) {
    this.x = x
    this.y = y
}
async function designDrill(logger, options) {
    // let dataAll = [['detaL m', 'α (°)', 'fai (°)', 'detaN m', 'detaE m', 'detaH m', 'detaS m', 'Kv (°)/30m', 'Kh (°)/30m', 'K (°)/30m', 'tao (°)/30m']],
    let dataAll = [],
        data3D = []
    let {
        Ht,//2500
        faiShe,//300
        Ha,//500
        K2,//6
        K4,//4
        a5,//12
        deltaH5,//300
        deltaHtf//50
    } = options
    faiShe = 300
    K2 = 6
    K4 = 4
    deltaHtf = 50
    let R2, R4, deltaL5

    R2 = 180 * 100 / (Math.PI * K2)
    R4 = 180 * 100 / (Math.PI * 4)
    deltaL5 = deltaH5 / vCos(a5)

    //传统公式

    let H0, A0, R0, deltaL3, a3
    //alph1 垂直，所以0
    let a1 = 0

    H0 = Ht - Ha * vCos(a1) - deltaL5 * vCos(a5)
        + R2 * (1 - vCos(a1)) + R4 * (1 - vCos(a5))




    let alph5 = 12
    let L1 = 500
    let alph1 = 0

    let L5 = 306.702

    H0 = 1997.812
    A0 = 867.534
    R0 = 2387.325
    let L3 = 775.691
    let alph3 = 34.739
    R2 = 954.930
    R4 = 1432.395

    //[N, E, H]
    let res3D = []
    //[L, alph, fai, H, N, E, S, Kalph]
    // let resAll = [['L', 'alph', 'fai', 'H', 'N', 'E', 'S', 'Kalph']]
    let O1 = new Point(R2 * vCos(a1) + L1 * vSin(a1), L1 * vCos(alph1) - R2 * vSin(alph1))
    let p1 = new Point(vSin(alph1) * L1, vCos(alph1) * L1)
    let p2 = new Point(p1.x + vCos(alph1) * R2 - vCos(alph3) * R2,
        p1.y + R2 * vSin(alph3) - vSin(alph1) * R2)
    let p3 = new Point(p2.x + vSin(alph3) * L3, p2.y + vCos(alph3) * L3)
    let O1y = L1 * vCos(alph1) - R2 * vSin(alph1)
    let O2y = O1y + H0
    let p4 = new Point(p1.x + A0 - (R4 - vCos(alph5) * R4),
        O1y + H0 - vSin(alph5) * R4)

    // console.log(`tan:${vTan(alph5)}`)
    // console.log(`p4.x:${p4.x}`)
    // console.log(`(O2y - p4.y):${(O2y - p4.y)}`)
    // console.log(`alph5:${alph5}`)
    // console.log(`(O2y - p4.y) / vTan(alph5):${(O2y - p4.y) / vTan(alph5)}`)
    let O2 = new Point(p4.x - (O2y - p4.y) / vTan(alph5), O2y)
    let p5 = new Point(p4.x + L5 * vSin(alph5), p4.y + L5 * vCos(alph5))

    let p0 = new Point(0, 0)
    let keyPointList = [
        p0, p1, p2, p3, p4, p5
    ]

    let kp3DList = keyPointList.map((v, i) => make3DPointFrom2D(v, faiShe))



    let p3d1 = make3DPointFrom2D(p1, faiShe)
    let p3d2 = make3DPointFrom2D(p2, faiShe)
    let p3d3 = make3DPointFrom2D(p3, faiShe)
    let p3d4 = make3DPointFrom2D(p4, faiShe)
    let p3d5 = make3DPointFrom2D(p5, faiShe)

    let detL = 0, AZIout, HLout, Kalp, Ck = 0


    dataAll.push([detL, a1, faiShe, 0, 0, 0, 0, 0])//井口

    detL += Math.sqrt(p1.x ** 2 + p1.y ** 2)
    dataAll.push([detL, a1, faiShe, -p3d1.z, p3d1.x, p3d1.y, p1.x, K2])//造斜
    //生成弧线

    let curvePos1 = makeCurve(O1, p1, p2, a1, alph3)

    detL += (2 * Math.PI * R2) / 360 * (alph3 - a1)


    dataAll.push([detL, alph3, faiShe, -p3d2.z, p3d2.x, p3d2.y, p2.x, 0])//稳斜

    detL += Math.sqrt((p3.x - p2.x) ** 2 + (p3.y - p2.y) ** 2)

    dataAll.push([detL, alph3, faiShe, -p3d3.z, p3d3.x, p3d3.y, p3.x, K4])//降斜

    detL += (2 * Math.PI * R4) / 360 * (alph3 - alph5)


    let curvePos2 = makeCurve(O2, p4, p3, alph5, alph3, false)


    dataAll.push([detL, alph5, faiShe, -p3d4.z, p3d4.x, p3d4.y, p4.x, 0])//稳斜

    detL += Math.sqrt((p5.x - p4.x) ** 2 + (p5.y - p4.y) ** 2)

    dataAll.push([detL, alph5, faiShe, -p3d5.z, p3d5.x, p3d5.y, p5.x, 0])//靶点
    data3D.push([0, 0, 0, 0])
    data3D.push([p3d1.x, p3d1.y, -p3d1.z, Math.sqrt(p3d1.x ** 2 + p3d1.y ** 2)])

    for (let item of curvePos1) {
        let pointTemp = make3DPointFrom2D(item, faiShe)
        data3D.push([pointTemp.x, pointTemp.y, -pointTemp.z, Math.sqrt(pointTemp.x ** 2 + pointTemp.y ** 2)])
    }
    data3D.push([p3d2.x, p3d2.y, -p3d2.z, Math.sqrt(p3d2.x ** 2 + p3d2.y ** 2)])
    data3D.push([p3d3.x, p3d3.y, -p3d3.z, Math.sqrt(p3d3.x ** 2 + p3d3.y ** 2)])
    for (let item of curvePos2) {
        let pointTemp = make3DPointFrom2D(item, faiShe)
        data3D.push([pointTemp.x, pointTemp.y, -pointTemp.z, Math.sqrt(pointTemp.x ** 2 + pointTemp.y ** 2)])
    }
    data3D.push([p3d4.x, p3d4.y, -p3d4.z, Math.sqrt(p3d4.x ** 2 + p3d4.y ** 2)])
    data3D.push([p3d5.x, p3d5.y, -p3d5.z, Math.sqrt(p3d5.x ** 2 + p3d5.y ** 2)])


    //计算口袋
    let p6 = new Point(p5.x + deltaHtf * vTan(alph5), p5.y + deltaHtf)  
    let p3d6 = make3DPointFrom2D(p6, faiShe)
    data3D.push([p3d6.x, p3d6.y, -p3d6.z, Math.sqrt(p3d6.x ** 2 + p3d6.y ** 2)])
    detL += Math.sqrt((p6.x - p5.x) ** 2 + (p6.y - p5.y) ** 2)

    dataAll.push([detL, alph5, faiShe, -p3d6.z, p3d6.x, p3d6.y, p6.x, 0])//靶点


    logger(Message.success('计算完毕,处理数据...'))
    await delay(500)
    logger(Message.success('Echart数据处理完毕'))
    await delay(500)
    return ({ dataAll, data3D })


}
/**
 * 
 * @param {2d点} point x->水平位移，y->竖直位移 
 * @param {*方位角} fai 与Y轴夹角 
 */
function make3DPointFrom2D(point, fai) {
    let N = point.x * vCos(fai)
    let E = point.x * vSin(fai)
    return new Point3D(N, E, point.y)
}

/**
 * 生成圆
 * @param {圆心} heart 
 * @param {*点} p1 
 * @param {*点} p2 
 * @param {*步长} step 
 */
function makeCurve(heart, p1, p2, a1, a3, flag = true, step = 1) {
    //半径

    let curvePos = [p1]

    let R = Math.sqrt((p1.y - heart.y) ** 2 + (p1.x - heart.x) ** 2)


    for (let i = a1 + step; i < a3; i += step) {
        let p = new Point()
        if (flag) {
            p.x = heart.x - R * vCos(i)
            p.y = heart.y + R * vSin(i)
        } else {

            p.x = heart.x + R * vCos(i)
            p.y = heart.y - R * vSin(i)
        }
        curvePos.push(p)
    }

    curvePos.push(p2)


    if (!flag) {
        curvePos.reverse()
    }

    return curvePos
}


export { designDrill, makeCurve }

