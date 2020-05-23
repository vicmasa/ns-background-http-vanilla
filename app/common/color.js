const colors_array=[
    '#00c875',
    '#fdab3d',
    '#e2445c',
    '#a25ddc',
    '#c4c4c4',
    '#579bfc',
    '#66ccff',
    '#0086c0',
    '#ffcb00',
    '#9cd326'
];
exports.colorArray=function(index){
    const val = index.toString();
    return colors_array[val.charAt(parseInt(val.length-1))];
}