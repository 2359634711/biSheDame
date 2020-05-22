
function targetToPointLS() {

  // #region 已知数据
  //井深
  let MD1 = 5365.0;
  let HL1 = 0;
  //造斜
  let Build_rad = 6 / 30.0 * Math.PI / 180;
  //增斜
  let Turn_rad = -2 / 30.0 * Math.PI / 180;
  //第一个点的北坐标
  let NS1 = 2.18;
  //第一个点的东坐标
  let EW1 = -53.85;
  //第一个点的垂深
  let TVD1 = 5345.90;
  //方位角rad
  let INCrad = 38.5 * Math.PI / 180;
  //井斜角rad
  let AZIrad = 309.50 * Math.PI / 180;
  //方位角
  let INC1 = 38.5;
  //井斜角
  let AZI1 = 309.50;
  //目标点坐标北坐标
  let NSt = 130;
  //目标点东坐标
  let EWt = -250;
  //目标点垂深
  let TVDt = 5470;



  // #endregion

  let data3D = []
  let dataAll = []



  let CL1, CL2, CL3, NS2, EW2, TVD2, HL2, MD2, INC2, AZI2, INC2rad, AZI2rad,
    NS3, EW3, TVD3, HL3, MD3, INC3, AZI3, INC3rad, AZI3rad, NS4, EW4, TVD4, HL4, MD4, INC4, AZI4

  // #region 计算过程
  //井口的3d坐标
  let PWellHead = new Point3D(NS1, EW1, TVD1);
  //目标的3d坐标
  let P_target = new Point3D(NSt, EWt, TVDt);
  //p3坐标
  let P3 = new Point3D();
  //第三段单位向量
  let V_3_T = new Vector3D();
  //第三段单位向量
  let V_3 = new Vector3D();
  //总体向量
  let V_H_T = P_target.sub(PWellHead);
  let CL3jilu = 0;
  let CL3jilusin = 0;
  let jiajiaoyuxian = 0;
  let jiajiaozhengxian = 0;
  let jiajiaoyuxianMax = -50000;
  let jiajiaozhengxianMin = 50000;
  let ijilu = -100, jjilu = -200;
  let ijilusin = -100, jjilusin = -200;
  //juli -> 首尾向量距离 为什么乘以2？
  let juli = V_H_T.Length() * 2;
  let fenshu = 20;
  //分成20段
  let duanchang = juli / fenshu;
  let NSout, EWout, TVDout, INCout, AZIout, HLout
  //分20段迭代
  for (let i = 1; i < fenshu; i++) {
    //当前总段长
    CL1 = i * duanchang;
    //分20次迭代
    for (let j = 1; j < fenshu; j++) {
      //当前总段长
      CL2 = j * duanchang;
      //根据自然曲线计算公式，来计算坐标、井深、方位角和井斜角等数据
      ({ NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(Math.min(CL1, CL2), INCrad, AZIrad, Build_rad, Turn_rad));
      //本段结束点参数 = 本段起始点参数 + 计算增量
      NS2 = NS1 + NSout;
      EW2 = EW1 + EWout;
      TVD2 = TVD1 + TVDout;
      HL2 = HL1 + HLout;
      MD2 = MD1 + CL1;
      INC2 = INCout * 180 / Math.PI;
      AZI2 = AZIout * 180 / Math.PI;
      INC2rad = INCout;
      AZI2rad = AZIout;

      if (CL2 > CL1) {
        //第二段造斜
        ({ NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(CL2 - CL1, INC2rad, AZI2rad, Build_rad, 0));
        NS3 = NS2 + NSout;
        EW3 = EW2 + EWout;
        TVD3 = TVD2 + TVDout;
        HL3 = HL2 + HLout;
        MD3 = MD2 + CL2;
        INC3 = INCout * 180 / Math.PI;
        AZI3 = AZIout * 180 / Math.PI;
      }
      else if (CL1 > CL2) {
        //第二段扭转
        ({ NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(CL1 - CL2, INC2rad, AZI2rad, 0, Turn_rad));
        NS3 = NS2 + NSout;
        EW3 = EW2 + EWout;
        TVD3 = TVD2 + TVDout;
        HL3 = HL2 + HLout;
        MD3 = MD2 + CL2;
        INC3 = INCout * 180 / Math.PI;
        AZI3 = AZIout * 180 / Math.PI;
      }
      else {
        //
        ({ NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(CL2 - CL1, INC2rad, AZI2rad, 0, 0));
        NS3 = NS2 + NSout;
        EW3 = EW2 + EWout;
        TVD3 = TVD2 + TVDout;
        HL3 = HL2 + HLout;
        MD3 = MD2 + CL2;
        INC3 = INCout * 180 / Math.PI;
        AZI3 = AZIout * 180 / Math.PI;
      }
      P3 = new Point3D(NS3, EW3, TVD3);
      V_3_T = P_target.sub(P3);
      CL3 = V_3_T.Length();
      V_3 = INCAZI2VECTOR(INC3, AZI3);
      V_3_T.Normalize();
      //向量点积dot product
      jiajiaoyuxian = Vector3D.DotProduct(V_3, V_3_T);
      //向量cross product
      jiajiaozhengxian = Vector3D.CrossProduct(V_3, V_3_T).Length();
      if (jiajiaozhengxian < jiajiaozhengxianMin) {
        jiajiaozhengxianMin = jiajiaozhengxian;
        ijilusin = i;
        jjilusin = j;
        CL3jilusin = CL3;
      }
      if (jiajiaoyuxian > jiajiaoyuxianMax) {
        jiajiaoyuxianMax = jiajiaoyuxian;
        ijilu = i;
        jjilu = j;
        CL3jilu = CL3;
      }
    }
  }
  let CL1jilu0 = ijilu * duanchang;
  let CL2jilu0 = jjilu * duanchang;
  let CL3jilu0 = CL3jilu;
  let CL1jilu = CL1jilu0;
  let CL2jilu = CL2jilu0;
  let wxl = 0.000000001;
  while (true) {
    CL1 = CL1jilu;
    CL2 = CL2jilu;
    CL3 = CL3jilu;

    jisuanyici_in_button3();
    let NS000 = NS4;
    let EW000 = EW4;
    let TVD000 = TVD4;

    CL1 = CL1jilu + wxl;
    CL2 = CL2jilu;
    CL3 = CL3jilu;
    jisuanyici_in_button3();
    let NS100 = NS4;
    let EW100 = EW4;
    let TVD100 = TVD4;

    CL1 = CL1jilu;
    CL2 = CL2jilu + wxl;
    CL3 = CL3jilu;
    jisuanyici_in_button3();
    let NS010 = NS4;
    let EW010 = EW4;
    let TVD010 = TVD4;


    CL1 = CL1jilu;
    CL2 = CL2jilu;
    CL3 = CL3jilu + wxl;
    jisuanyici_in_button3();
    let NS001 = NS4;
    let EW001 = EW4;
    let TVD001 = TVD4;

    let PDS_NS_CL1 = (NS100 - NS000) / wxl;
    let PDS_NS_CL2 = (NS010 - NS000) / wxl;
    let PDS_NS_CL3 = (NS001 - NS000) / wxl;

    let PDS_EW_CL1 = (EW100 - EW000) / wxl;
    let PDS_EW_CL2 = (EW010 - EW000) / wxl;
    let PDS_EW_CL3 = (EW001 - EW000) / wxl;

    let PDS_TVD_CL1 = (TVD100 - TVD000) / wxl;
    let PDS_TVD_CL2 = (TVD010 - TVD000) / wxl;
    let PDS_TVD_CL3 = (TVD001 - TVD000) / wxl;
    let detaNS = NS000 - NSt;
    let detaEW = EW000 - EWt;
    let detaTVD = TVD000 - TVDt;
    let fenmu = hanglieshi3(PDS_NS_CL1, PDS_EW_CL1, PDS_TVD_CL1, PDS_NS_CL2, PDS_EW_CL2, PDS_TVD_CL2, PDS_NS_CL3, PDS_EW_CL3, PDS_TVD_CL3);
    let fenziCL1 = hanglieshi3(detaNS, detaEW, detaTVD, PDS_NS_CL2, PDS_EW_CL2, PDS_TVD_CL2, PDS_NS_CL3, PDS_EW_CL3, PDS_TVD_CL3);
    let fenziCL2 = hanglieshi3(PDS_NS_CL1, PDS_EW_CL1, PDS_TVD_CL1, detaNS, detaEW, detaTVD, PDS_NS_CL3, PDS_EW_CL3, PDS_TVD_CL3);
    let fenziCL3 = hanglieshi3(PDS_NS_CL1, PDS_EW_CL1, PDS_TVD_CL1, PDS_NS_CL2, PDS_EW_CL2, PDS_TVD_CL2, detaNS, detaEW, detaTVD);
    let detaCL1 = fenziCL1 / fenmu;
    let detaCL2 = fenziCL2 / fenmu;
    let detaCL3 = fenziCL3 / fenmu;
    CL1jilu = CL1jilu - detaCL1;
    CL2jilu = CL2jilu - detaCL2;
    CL3jilu = CL3jilu - detaCL3;
    if (Math.abs(detaCL1) + Math.abs(detaCL2) + Math.abs(detaCL3) < 0.0000001) {
      break;
    }
  }

  CL1 = CL1jilu;
  CL2 = CL2jilu;
  CL3 = CL3jilu;

  //最后一次计算，并且绘制图像

  zuihouyicijisuan_inbutton3();

  let NS0000 = NS4;
  let EW0000 = EW4;
  let TVD0000 = TVD4;




  //  计算结果：记录4个关键点的井深、井斜角和方位角
  let p1 = new Point3D(MD1, INC1, AZI1);//landmark   5365       38.5    309.5       本程序5365       38.5    309.5 
  let p2 = new Point3D(MD2, INC2, AZI2);//landmark   5482.2007  61.94   301.687     本程序5482.2536  61.9507   301.683 
  let p3 = new Point3D(MD3, INC3, AZI3);//landmark   5538.1170  73.123  301.687     本程序5538.1170  73.123    301.683 
  let p4 = new Point3D(MD4, INC4, AZI4);//landmark   5635.5861  73.123  301.687     本程序5635.5861  73.123    301.683


  let Build = Build_rad * 180 / Math.PI * 30
  let Turn = Turn_rad * 180 / Math.PI * 30

  dataAll.push([MD1, INC1, AZI1, TVD1, NS1, EW1, HL1, Build, Turn])
  dataAll.push([MD2, INC2, AZI2, TVD2, NS2, EW2, HL2, CL1 < CL2 ? Build : 0, CL1 > CL2 ? Turn : 0])
  dataAll.push([MD3, INC3, AZI3, TVD3, NS3, EW3, HL3, 0, 0])
  dataAll.push([MD4, INC4, AZI4, TVD4, NS4, EW4, HL4, 0, 0])
  return { data3D, dataAll }
  //end of function





  function jisuanyici_in_button3() {
    ({ NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(Math.min(CL1, CL2), INCrad, AZIrad, Build_rad, Turn_rad));
    NS2 = NS1 + NSout;
    EW2 = EW1 + EWout;
    TVD2 = TVD1 + TVDout;
    HL2 = HL1 + HLout;
    MD2 = MD1 + CL1;
    INC2 = INCout * 180 / Math.PI;
    AZI2 = AZIout * 180 / Math.PI;
    INC2rad = INCout;
    AZI2rad = AZIout;

    if (CL2 > CL1) {
      ({ NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(CL2 - CL1, INC2rad, AZI2rad, Build_rad, 0));
      NS3 = NS2 + NSout;
      EW3 = EW2 + EWout;
      TVD3 = TVD2 + TVDout;
      HL3 = HL2 + HLout;
      MD3 = MD2 + CL2 - CL1;
      INC3 = INCout * 180 / Math.PI;
      AZI3 = AZIout * 180 / Math.PI;
    }
    else if (CL1 > CL2) {
      ({ NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(CL1 - CL2, INC2rad, AZI2rad, 0, Turn_rad));
      NS3 = NS2 + NSout;
      EW3 = EW2 + EWout;
      TVD3 = TVD2 + TVDout;
      HL3 = HL2 + HLout;
      MD3 = MD2 + CL1 - CL2;
      INC3 = INCout * 180 / Math.PI;
      AZI3 = AZIout * 180 / Math.PI;
    }
    else {
      //井斜角和方位角同时达到要求
      //ziranquxianjibenjisuan(CL2 - CL1, INC2rad, AZI2rad, 0, 0, out NSout, out EWout, out TVDout, out INCout, out AZIout, out HLout);
      NS3 = NS2;
      EW3 = EW2;
      TVD3 = TVD2;
      HL3 = HL2;
      MD3 = MD2;
      INC3 = INC2;
      AZI3 = AZI2;
    }
    INC3rad = INCout;
    AZI3rad = AZIout;
    ({ NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(CL3, INC3rad, AZI3rad, 0, 0));

    NS4 = NS3 + NSout;
    EW4 = EW3 + EWout;
    TVD4 = TVD3 + TVDout;
    HL4 = HL3 + HLout;
    MD4 = MD3 + CL3;
    INC4 = INCout * 180 / Math.PI;
    AZI4 = AZIout * 180 / Math.PI;

  }





  function zuihouyicijisuan_inbutton3() {

    data3D.push([NS1, EW1, -TVD1, 0]);

    //扭转+造斜
    ({ NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(Math.min(CL1, CL2), INCrad, AZIrad, Build_rad, Turn_rad));
    NS2 = NS1 + NSout;
    EW2 = EW1 + EWout;
    TVD2 = TVD1 + TVDout;
    HL2 = HL1 + HLout;
    MD2 = MD1 + CL1;
    INC2 = INCout * 180 / Math.PI;
    AZI2 = AZIout * 180 / Math.PI;
    INC2rad = INCout;
    AZI2rad = AZIout;

    //第一段data3D点集计算 Start
    for (let i = 0; i < Math.min(CL1, CL2); i += 10) {
      ({ NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(i, INCrad, AZIrad, Build_rad, Turn_rad));
      let point = new Point3D(NSout, EWout, TVDout)
      point = point.add(PWellHead)
      data3D.push([point.x, point.y, -point.z, Math.sqrt((point.x - NS1) ** 2 + (point.y - EW1) ** 2)])
    }
    //第一段data3D点集计算 End

    //第一段末尾点
    let point3D1 = new Point3D(NS2, EW2, TVD2)
    data3D.push([point3D1.x, point3D1.y, -point3D1.z, Math.sqrt((point3D1.x - NS1) ** 2 + (point3D1.y - EW1) ** 2)])



    if (CL2 > CL1) {
      //造斜
      ({ NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(CL2 - CL1, INC2rad, AZI2rad, Build_rad, 0));
      NS3 = NS2 + NSout;
      EW3 = EW2 + EWout;
      TVD3 = TVD2 + TVDout;
      HL3 = HL2 + HLout;
      MD3 = MD2 + CL2 - CL1;
      INC3 = INCout * 180 / Math.PI;
      AZI3 = AZIout * 180 / Math.PI;

      //第二段data3D点集计算 Start
      for (let i = 0; i < CL2 - CL1; i += 10) {
        ({ NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(i, INC2rad, AZI2rad, Build_rad, 0));
        let point = new Point3D(NSout, EWout, TVDout)
        point = point.add(point3D1)
        data3D.push([point.x, point.y, -point.z, Math.sqrt((point.x - NS1) ** 2 + (point.y - EW1) ** 2)])
      }
      //第二段data3D点集计算 End

    }
    else if (CL1 > CL2) {
      //扭转
      ({ NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(CL1 - CL2, INC2rad, AZI2rad, 0, Turn_rad));
      NS3 = NS2 + NSout;
      EW3 = EW2 + EWout;
      TVD3 = TVD2 + TVDout;
      HL3 = HL2 + HLout;
      MD3 = MD2 + CL1 - CL2;
      INC3 = INCout * 180 / Math.PI;
      AZI3 = AZIout * 180 / Math.PI;

      //第二段data3D点集计算 Start
      for (let i = 0; i < CL1 - CL2; i += 10) {
        ({ NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(i, INC2rad, AZI2rad, 0, Turn_rad));
        let point = new Point3D(NSout, EWout, TVDout)
        point = point.add(point3D1)
        data3D.push([point.x, point.y, -point.z, Math.sqrt((point.x - NS1) ** 2 + (point.y - EW1) ** 2)])
      }
      //第二段data3D点集计算 End
    }
    else {
      //井斜角和方位角同时达到要求
      //ziranquxianjibenjisuan(CL2 - CL1, INC2rad, AZI2rad, 0, 0, out NSout, out EWout, out TVDout, out INCout, out AZIout, out HLout);
      NS3 = NS2;
      EW3 = EW2;
      TVD3 = TVD2;
      HL3 = HL2;
      MD3 = MD2;
      INC3 = INC2;
      AZI3 = AZI2;
    }
    //绘制 第二段末尾点
    data3D.push([NS3, EW3, -TVD3, Math.sqrt((NS3 - NS1) ** 2 + (EW3 - EW1) ** 2)])


    INC3rad = INCout;
    AZI3rad = AZIout;
    ({ NSout, EWout, TVDout, INCout, AZIout, HLout } = ziranquxianjibenjisuan(CL3, INC3rad, AZI3rad, 0, 0));

    NS4 = NS3 + NSout;
    EW4 = EW3 + EWout;
    TVD4 = TVD3 + TVDout;
    HL4 = HL3 + HLout;
    MD4 = MD3 + CL3;
    INC4 = INCout * 180 / Math.PI;
    AZI4 = AZIout * 180 / Math.PI;
    data3D.push([NS4, EW4, -TVD4, Math.sqrt((NS4 - NS1) ** 2 + (EW4 - EW1) ** 2)])

  }
}


function hanglieshi3(a11, a12, a13, a21, a22, a23, a31, a32, a33) {
  let ret = a11 * a22 * a33 + a12 * a23 * a31 + a13 * a21 * a32;
  ret = ret - a13 * a22 * a31 - a12 * a21 * a33 - a11 * a23 * a32;
  return ret;
  // throw new NotImplementedException();
}


function Point3D(x, y, z, s) {
  this.x = x
  this.y = y
  this.z = z
  this.s = s
  this.sub = (p) => {
    //this - p
    let vec = new Vector3D(this.x - p.x, this.y - p.y, this.z - p.z)
    return vec
  }
  this.add = (p) => {
    //this - p
    let point = new Point3D(p.x + this.x, p.y + this.y, p.z + this.z)
    return point
  }
}

function Vector3D(x, y, z) {
  this.x = x
  this.y = y
  this.z = z
  this.Length = () => {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
  }
  this.Normalize = () => {
    let length = this.Length()
    this.x /= length
    this.y /= length
    this.z /= length
  }
}

Vector3D.DotProduct = (vec3D1, vec3D2) => {
  return vec3D1.x * vec3D2.x + vec3D1.y * vec3D2.y + vec3D1.z * vec3D2.z
}
Vector3D.CrossProduct = (vec3D1, vec3D2) => {
  return new Vector3D(
    vec3D1.y * vec3D2.z - vec3D1.z * vec3D2.y,
    vec3D1.z * vec3D2.x - vec3D1.x * vec3D2.z,
    vec3D1.x * vec3D2.y - vec3D1.y * vec3D2.x,
  )
}

function INCAZI2VECTOR(INC, AZI) {
  let INCr = INC * Math.PI / 180;
  let AZIr = AZI * Math.PI / 180;
  let Z = Math.cos(INCr);
  let shuipingtouying = Math.sin(INCr);
  let X = shuipingtouying * Math.cos(AZIr);
  let Y = shuipingtouying * Math.sin(AZIr);
  return new Vector3D(X, Y, Z);
}


function ziranquxianjibenjisuan(CL, INCrad, AZIrad, Build_rad, Turn_rad) {
  let NSout, EWout, TVDout, INCout, AZIout, HLout
  INCout = INCrad + CL * Build_rad;
  AZIout = AZIrad + CL * Turn_rad;
  while (AZIout < 0) {
    AZIout = AZIout + Math.PI * 2;
  }
  while (AZIout >= Math.PI * 2) {
    AZIout = AZIout - Math.PI * 2;
  }
  let kp = Build_rad + Turn_rad, kq = Build_rad - Turn_rad;//《井眼轨道几何学》公式5-58
  let Ap = INCrad + AZIrad, Aq = INCrad - AZIrad;//《井眼轨道几何学》公式5-57

  if (Math.abs(kp) <= 0.00001) {
    if (Math.abs(kq) <= 0.00001) {
      NSout = 0 + CL * Math.sin(INCrad) * Math.cos(AZIrad);
      EWout = 0 + CL * Math.sin(INCrad) * Math.sin(AZIrad);
    }
    else {
      NSout = 0 + (CL * Math.sin(Ap) + Fc(Aq, kq, CL)) / 2;
      EWout = 0 + (Fs(Aq, kq, CL) - CL * Math.cos(Ap)) / 2;
    }

  }
  else {
    if (Math.abs(kq) <= 0.00001) {
      NSout = 0 + (CL * Math.sin(Aq) + Fc(Ap, kp, CL)) / 2;
      EWout = 0 + (CL * Math.cos(Aq) - Fs(Ap, kp, CL)) / 2;
    }
    else {
      NSout = 0 + (Fc(Ap, kp, CL) + Fc(Aq, kq, CL)) / 2;
      EWout = 0 + (Fs(Aq, kq, CL) - Fs(Ap, kp, CL)) / 2;
    }
  }

  if (Math.abs(Build_rad) <= 0.00001) {
    TVDout = 0 + CL * Math.cos(INCrad);
    HLout = 0 + CL * Math.sin(INCrad);
  }
  else {
    TVDout = 0 + (-Math.sin(INCrad) + Math.sin(INCrad + Build_rad * CL)) / Build_rad;
    HLout = 0 + (Math.cos(INCrad) - Math.cos(INCrad + Build_rad * CL)) / Build_rad;
  }

  return {
    NSout, EWout, TVDout, INCout, AZIout, HLout
  }
}


// targetToPointLS()


function Fs(beta, x, CL) {
  let y;
  y = (Math.sin(beta + x * CL) - Math.sin(beta)) / x;
  return y;
}

function Fc(beta, x, CL) {
  let y;
  y = (Math.cos(beta) - Math.cos(beta + x * CL)) / x;
  return y;
}


export { targetToPointLS }