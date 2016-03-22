function createDateFromString1(sDate) {
    return new Date(sDate.substr(6, 4), sDate.substr(3, 2) - 1, sDate.substr(0, 2));
}
function createDateFromString(sDate) {
    var aDate = sDate.split("/");
    return new Date(aDate[2], aDate[1] - 1, aDate[0]);
}

function DateDiff(date1, date2) {
    var datediff = date1.getTime() - date2.getTime(); //store the getTime diff - or +
    return (datediff / (24 * 60 * 60 * 1000)); //Convert values to -/+ days and return value      
}

function controlarAcceso() {

    //for (var j = 0; j < gv.us.Roles.length; j++) {
    //    if (parseInt(gv.us.Roles[j].ValorNivel) >= 2 && (gv.us.Roles[j].TituloArea == "Aéreos" || gv.us.Roles[j].TituloArea == "Sistemas"))
    //        //window.alert("Nivel" + _us.Roles[j].ValorNivel + " Area " + _us.Roles[j].TituloArea);
    //        return true;
    //}
    return true;

}
