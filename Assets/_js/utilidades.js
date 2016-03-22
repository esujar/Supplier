removeItemFromArray = function (array, property) {
    var idx = _.findIndex(array || [], property);
    array.splice(idx, 1);
    return array;
}
function createDateFromString(sDate) {
    var aDate = sDate.split("/");
    return new Date(aDate[2], aDate[1] - 1, aDate[0]);
}

String.prototype.replaceAll = function (str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
}