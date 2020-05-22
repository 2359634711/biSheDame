
let option3D = {
    tooltip: {},
    backgroundColor: '#fff',
    xAxis3D: {
        type: 'value',
        scale: true
    },
    yAxis3D: {
        type: 'value',
        scale: true
    },
    zAxis3D: {
        type: 'value',
        scale: true
    },
    grid3D: {
        viewControl: {
            projection: 'orthographic'
        }
    },
    series: [{
        lineStyle: {
            width: 4
        },
        name: '3维井眼轨道设计曲线'
    }]
};

let option2D = {
    tooltip: {},
    backgroundColor: '#fff',
    xAxis: {
        type: 'value',
        scale: true
    },
    yAxis: {
        type: 'value',
        scale: true
    },
    series: [{
        type: 'line',
        scale: true
    }]
};

function makeOption(type, data, name){
    let option
    if(type == '3d'){
        option = option3D
        option.xAxis3D.name = name[0]
        option.yAxis3D.name = name[1]
        option.zAxis3D.name = name[2]
        option.series[0].data = data
        option.series[0].type = 'line3D'
    }
    if(type == '2d'){
        option = option2D
        option.xAxis.name = name[0]
        option.yAxis.name = name[1]
        option.series[0].data = data
    }
    return option
}

export default makeOption