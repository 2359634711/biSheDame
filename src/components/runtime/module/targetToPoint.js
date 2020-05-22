import {
    naturalCurveModule3D,
    ziranquxianjibenjisuan,
} from './naturalCurve.js'

import { Vector, vArcTan, Point3D, make2DPointFrom3D } from './common'

function targetToPoint(logger, options) {
    let {
        MD1,
        Build_rad,
        Turn_rad,
        NS1,
        EW1,
        TVD1,
        INCrad,
        AZIrad,
        INC1,
        HL1,
        AZI1,
        NSt,
        EWt,
        TVDt
    } = options

    // #region 已知数据
    //井深
    MD1 = 5365.0;
    //水平位移 ???没啥用?
    HL1 = 0;
    //造斜
    Build_rad = 6 / 30.0;
    //增斜
    Turn_rad = -2 / 30.0;
    //第一个点的北坐标
    NS1 = 2.18;
    //第一个点的东坐标
    EW1 = -53.85;
    //第一个点的垂深
    TVD1 = 5345.90;
    // //井斜角rad
    // INCrad = 38.5;
    // //方位角rad
    // AZIrad = 309.50;
    //井斜角
    INC1 = 38.5;
    //方位角
    AZI1 = 309.50;
    //目标点坐标北坐标
    NSt = 130;
    //目标点东坐标
    EWt = -250;
    //目标点垂深
    TVDt = 5470;
    // #endregion

    let stepNum = 20

    //总段向量
    let vecTotle = new Vector(NSt - NS1, EWt - EW1, TVDt - TVD1)
    let point3dTarget = new Point3D(NSt, EWt, TVDt)

    //井段总长
    let lengthMax = vecTotle.getLength() * 2

    //itemLength 段长
    let itemLength = lengthMax / stepNum

    //cl1 currentLength -> 目前段长
    //cl2 currentLength -> 目前段长
    let cl1 = 0
    let cl2 = 0
    let dataAll = []
    let data3D = []
    //记录i j
    let isave = 0
    let jsave = 0
    data3D.push([NS1, EW1, -TVD1])



    let iLengthMax = lengthMax
    let iLengthMin = 0
    let iMid = 0

    //确定第一分段
    while (iLengthMax - iLengthMin > 0.1) {
        iMid = (iLengthMin + iLengthMax) / 2
        let { NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(iMid, INC1, AZI1, Build_rad, Turn_rad)
        //判断水平-z方向 井斜角是否满足
        let point3d1 = new Point3D(NS1 + NSout, EW1 + EWout, TVD1 + TVDout)
        let point3d2 = point3dTarget
        let point1 = make2DPointFrom3D(point3d1, 2)
        let point2 = make2DPointFrom3D(point3d2, 2)
        let flag = checkAlph(Build_rad, INCout, point1, point2)
        if (flag) {
            //达到要求
            iLengthMax = iMid
        } else {
            iLengthMin = iMid
        }
    }
    let buildLength = iMid


    iLengthMax = lengthMax
    iLengthMin = 0
    iMid = 0
    //确定水平分段
    while (iLengthMax - iLengthMin > 0.1) {
        iMid = (iLengthMin + iLengthMax) / 2
        let { NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(iMid, INC1, AZI1, Build_rad, Turn_rad)
        //判断水平-z方向 井斜角是否满足
        let point3d1 = new Point3D(NS1 + NSout, EW1 + EWout, TVD1 + TVDout)
        let point3d2 = point3dTarget
        let point1 = make2DPointFrom3D(point3d1, 1)
        let point2 = make2DPointFrom3D(point3d2, 1)
        let flag = checkAlph(Turn_rad, AZIout, point1, point2)
        if (flag) {
            //达到要求
            iLengthMax = iMid
        } else {
            iLengthMin = iMid
        }
    }
    let turnLength = iMid



    let res = null
    let minLength = Math.min(buildLength, turnLength)//获取第一段双增
    let secType = 0 // 1-> turn 2->build
    if (buildLength < turnLength) {
        secType = 1
    } else {
        secType = 2
    }

    res = naturalCurveModule3D({
        N1: NS1,
        E1: EW1,
        H1: TVD1,
        S1: HL1,
        alp0: INC1,
        fai0: AZI1,
        detL: 0,
        Kalp: Build_rad,
        Kfai: Turn_rad,
        maxL: minLength,
        startL: MD1
    })
    //第一段结束点
    if (res.data3D) {

        data3D.push(...res.data3D)
        dataAll.push(...res.dataAll)

    }
    //获取第一段最后一个点的信息
    res = ziranquxianjibenjisuan(minLength, INC1, AZI1, Build_rad, Turn_rad)
    // let p3d2 = new Point3D(NS1 + res.NSout, EW1 + res.EWout, TVD1 + res.TVDout, res.HLout)

    let secLength = getNaturalLength({
        type: secType,
        SP: new Point3D(data3D[data3D.length - 1][0], data3D[data3D.length - 1][1], -data3D[data3D.length - 1][2]),
        EP: point3dTarget,
        lengthMax,
        alp: res.INCout,
        fai: res.AZIout,
        Kalp: Build_rad,
        Kfai: Turn_rad 
    })//获取第二段单增


    console.log(minLength, secLength)


    let tempData = dataAll[dataAll.length - 1]
    if (buildLength < turnLength) {
        // res = ziranquxianjibenjisuan(secLength - minLength, res.INCout, res.AZIout, 0, Turn_rad)

        res = naturalCurveModule3D({
            N1: data3D[data3D.length - 1][0],
            E1: data3D[data3D.length - 1][1],
            H1: -data3D[data3D.length - 1][2],
            S1: HL1 + res.HLout,
            alp0: res.INCout,
            fai0: res.AZIout,
            detL: 0,
            Kalp: 0,
            Kfai: Turn_rad,
            maxL: secLength,
            startL: MD1 + minLength
        })

    } else {
        // res = ziranquxianjibenjisuan(secLength - minLength, res.INCout, res.AZIout, Build_rad, 0)
        res = naturalCurveModule3D({
            N1: data3D[data3D.length - 1][0],
            E1: data3D[data3D.length - 1][1],
            H1: -data3D[data3D.length - 1][2],
            S1: HL1 + res.HLout,
            alp0: res.INCout,
            fai0: res.AZIout,
            detL: 0,
            Kalp: Build_rad,
            Kfai: 0,
            maxL: secLength,
            startL: MD1 + minLength
        })
    }
    // let p3d3 = new Point3D(p3d2.x + res.NSout, p3d2.y + res.EWout, p3d2.z + res.TVDout, res.HLout)

    // 第二段结束点
    if (res.data3D) {
        data3D.push(...res.data3D)
        dataAll.push(...res.dataAll)
    }
    // for (let i = 0; i < stepNum; ++i) {
    //     cl1 = i * itemLength
    //     let { NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(cl1, INC1, AZI1, Build_rad, Turn_rad)


    //     if (checkAlph(Build_rad, INCout, point1, point2)) {
    //         //第二段

    //     }

    // data3D.push([p3d3.x, p3d3.y, -p3d3.z])
    data3D.push([NSt, EWt, -TVDt])
    //     dataAll.push([cl1, INCout, AZIout, NSout, EWout, TVDout, HLout, Build_rad])


    //     isave = i
    // }

    return ({ dataAll, data3D })

}




/**
 * 
 * @param {*} type 
 * @param {*} SP 
 * @param {*} EP 
 * @param {*} lengthMax 
 * @param {*} alp 
 * @param {*} fai 
 * @param {*} Kalp 
 * @param {*} Kfai 
 * 
 */
function getNaturalLength(options) {
    let {
        type,//  1turn 2build
        SP,//start Point
        EP,//end Point
        lengthMax,
        alp,
        fai,
        Kalp,
        Kfai
    } = options
    let iLengthMax = lengthMax
    let iLengthMin = 0
    let iMid = 0
    //水平时 Kalp = 0
    if(type == 1){
        Kalp = 0
    }
    //竖直时 Kfai = 0
    if(type == 2){
        Kfai = 0
    }
    //确定水平分段
    while (iLengthMax - iLengthMin > 0.1) {
        iMid = (iLengthMin + iLengthMax) / 2
        let { NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(iMid, alp, fai, Kalp, Kfai)
        //判断水平-z方向 井斜角是否满足
        let point3d1 = new Point3D(SP.x + NSout, SP.y + EWout, SP.z + TVDout)
        let point3d2 = EP
        let point1 = make2DPointFrom3D(point3d1, type)
        let point2 = make2DPointFrom3D(point3d2, type)
        let flag
        if (type == 1) {
            //水平
            flag = checkAlph(Kfai, AZIout, point1, point2)

        } else {
            //竖直
            flag = checkAlph(Kalp, INCout, point1, point2)
        }
        if (flag) {
            //达到要求
            iLengthMax = iMid
        } else {
            iLengthMin = iMid
        }
    }
    return (iLengthMax + iLengthMin) / 2
}

/**
 * 
 * @param {Build} Kalph 
 * @param {alph} alph 
 * @param {点1} p1 
 * @param {点2} p2 
 */
function checkAlph(Kalph, alph, p1, p2) {
    //目标alph
    let alphTarget = vArcTan((p2.x - p1.x) / (p2.y - p1.y))
    if(alphTarget < 0) return true
    if (alph < alphTarget) {
        if (Kalph < 0) return true
    }
    if (alph > alphTarget) {
        if (Kalph > 0) return true

    }
    return false
}


export {
    targetToPoint
}