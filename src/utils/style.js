
// function setStyle(name, value, dom = 'root'){
// }

// module.exports = {
//     setStyle
// }
function setTheme(type){
    console.log(type)
    const root = document.getElementById('root')
    switch(type){
        case 'white':{
            root.className = 'whiteTheme'
            break;
        }
        case 'black':{
            root.className = 'blackTheme'
            break;
        }
    }
}

module.exports = {
    setTheme
}