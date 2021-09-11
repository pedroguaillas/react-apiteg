export const formatDate = () => {
    var monthNames = [
        "enero", "febrero", "marzo",
        "abril", "mayo", "junio", "julio",
        "agosto", "septiembre", "octubre",
        "noviembre", "diciembre"
    ];

    var date = new Date();
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' del ' + year;
}

export const calMaxLenght = (accounts) => {
    let max = 0;
    accounts.forEach(element => {
        let len = count_chars(element.account)
        max = len > max ? len : max
    })
    return max
}

export const count_chars = (str) => {
    let sum = 0
    for (var i = 0; i < str.length; i++) {
        if (str.charAt(i) === '.') {
            sum++
        }
    }
    return sum
}

export const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")