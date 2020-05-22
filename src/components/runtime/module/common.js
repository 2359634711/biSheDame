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

//arcCos
const vArcCos = vAngle => Math.round(Math.acos((vAngle)) * 1000000) / 1000000;
//arcSin
const vArcSin = vAngle => Math.round(Math.asin((vAngle)) * 1000000) / 1000000;
//vTan
const vTan = vAngle => Math.round(Math.tan((vAngle * Math.PI / 180)) * 1000000) / 1000000;
//vArcTan
const vArcTan = vAngle => Math.round(Math.atan((vAngle)) * 1000000) / 1000000 * 180 / Math.PI;

const delay = t => new Promise(resolve => {
    setTimeout(resolve, t)
})
/**
 * 
 * @param {水平} x 
 * @param {垂直} y 
 * @param {井深} s 
 */
function Point(x, y, s) {
    this.x = x
    this.y = y
    this.s = s
}

/**
 * 
 * @param {N} x 
 * @param {E} y 
 * @param {Z} z 
 * @param {井深} s 
 */
function Point3D(x, y, z, s) {
    this.x = x
    this.y = y
    this.z = z
    this.s = s
}

function Vector(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    this.sub = (vector) => {
        this.x -= vector.x
        this.y -= vector.y
        this.z -= vector.z
    }
    this.add = (vector) => {
        this.x += vector.x
        this.y += vector.y
        this.z += vector.z
    }
    this.getLength = () => {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
    }
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
 * 
 * @param {3d点} point x->水平位移，y->竖直位移 
 * @param {1->x0y 2->z0水平} 1->x0y 2->z0水平
 */
function make2DPointFrom3D(point3d, type) {
    let point2d = new Point()
    if (type == 1) {
        point2d.x = point3d.x
        point2d.y = point3d.y
    }
    if (type == 2) {
        point2d.x = Math.sqrt(point3d.x ** 2 + point3d.y ** 2)
        point2d.y = point3d.z

    }
    return point2d
}
export {
    Message,
    vSin,
    vCos,
    delay,
    // vArcCos,
    // vArcSin,
    vTan,
    Point3D,
    Vector,
    vArcTan,
    make2DPointFrom3D
}