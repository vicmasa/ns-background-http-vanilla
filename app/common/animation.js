function getAnimation(animation) {
    const duration=250;
    switch (animation) {
        case 'fadeInUp':
            return {
                opacity: 1,
                translate: { x: 0, y: 0 },
                duration: duration,
                delay: 0,
                iterations: 1
            };
        case 'fadeOutDown':
            return {
                opacity: 0,
                translate: { x: 0, y: 500 },
                duration: duration,//delay after select
                delay: 0,
                iterations: 1
            };
        case 'bounceIn':
            return {
                opacity: 1,
                duration: duration,
                delay: 0,
                iterations: 1
            };
        case 'bounceOut':
            return {
                opacity: 0,
                duration: duration,
                delay: 0,
                iterations: 1
            };
        case 'bounceInActionBar':
            return {
                backgroundColor: '#a3a3a3', //'rgba(0,  0,  0,  0.4)',
                opacity: 1, 
                duration: duration
            };
        case 'bounceOutActionBar':
            return {
                backgroundColor: 'white',
                opacity: 1,
                duration: duration
            };
        default:
            break;
    }
}
exports.animation = function (item, animation) {
    item.animate(getAnimation(animation)).then(() => {
    }).catch(() => {
    });
}