exports.getDatedif = function (fecha) {
    try {
        fecha = fecha.replace(/-/g, '/');
        fecha = new Date(fecha);
        const now = new Date();
        const seg = (now - fecha) / 1000;

        const dias = Math.floor(seg / 60 / 60 / 24);
        const horas = Math.round(seg / 60 / 60) % 24;
        const minutos = Math.round(seg / 60) % 60;
        const segundos = Math.round(seg) % 60;

        const d = dias > 0 ? dias + ' días ' : '';
        const h = horas > 0 ? horas + ' horas ' : '';
        const m = minutos > 0 ? minutos + ' min ' : '';
        const s = segundos > 0 ? segundos + ' seg' : '1 seg';

        const diff = dias > 1 ? d : (horas > 1 ? h : (minutos > 1 ? m : s));
        return 'hace ' + diff;
    } catch (e) {
        return '';
    }
}
exports.formatDateTimeMySql = function (fecha) {
    if (typeof fecha == "string") {
        fecha = fecha.replace(/-/g, '/');
    }
    const date = new Date(fecha),
        year = date.getFullYear(),
        month = (date.getMonth() + 1).toString(),
        formatedMonth = (month.length === 1) ? ('0' + month) : month,
        day = date.getDate().toString(),
        formatedDay = (day.length === 1) ? ('0' + day) : day,
        hour = date.getHours().toString(),
        formatedHour = (hour.length === 1) ? ('0' + hour) : hour,
        minute = date.getMinutes().toString(),
        formatedMinute = (minute.length === 1) ? ('0' + minute) : minute,
        second = date.getSeconds().toString(),
        formatedSecond = (second.length === 1) ? ('0' + second) : second;
    return year + '-' + formatedMonth + '-' + formatedDay + ' ' + formatedHour + ':' + formatedMinute + ':' + formatedSecond;
};
exports.formatDateMySql = function (date) {
    date = new Date(date);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
}
exports.formatDate = function (date) {
    date = new Date(date);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return y + '/' + (m < 10 ? '0' + m : m) + '/' + (d < 10 ? '0' + d : d);
}
exports.addDays = function (fecha, cantidad) {
    var myDate = new Date(fecha);
    myDate.setDate(myDate.getDate() + cantidad);
    return myDate;
}
exports.getMonth = function (mes, getName) {
    const meses = { 0: 'Enero', 1: 'Febrero', 2: 'Marzo', 3: 'Abril', 4: 'Mayo', 5: 'Junio', 6: 'Julio', 7: 'Agosto', 8: 'Septiembre', 9: 'Octubre', 10: 'Noviembre', 11: 'Diciembre' };
    if (getName) {
        return meses[mes];
    } else {
        for (var i in meses) {
            if (meses[i] == mes) {
                return i;
            }
        }
    }
}
exports.formatDateTimeUrl = function (fecha) {
    fecha = fecha.replace(/:/g, '%3A');
    fecha = fecha.replace(' ', '%20');
    return fecha;
}