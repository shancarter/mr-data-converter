// adapted from http://stackoverflow.com/questions/1876485/get-property-names-in-json-objects
function GetHeaders(obj) {
    var cols = new Array();
    var p = obj[0];
    for (var key in p) {
        //alert(' name=' + key + ' value=' + p[key]);
        cols.push(key);
    }
    return cols;
}

// JSON to CSV Converter
// adapted from http://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    
    var headers = GetHeaders(objArray);
    str += headers + '\r\n';
    
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}


