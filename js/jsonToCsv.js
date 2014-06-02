// adapted from http://stackoverflow.com/questions/9767133/javascript-getting-all-existing-keys-in-a-json-array
function GetHeaders(jsonArray) {
    var L = jsonArray.length;
    var line = '';
    for (var i = 0; i < L; i++) {
        var obj = jsonArray[i];
        alert(obj);
        for (var j in obj) {
            if (line != '') line += ','
            line += j;
        }
    }
    alert(line);
    return line;
}

// JSON to CSV Converter
// adapted from http://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    
    var headers = GetHeaders(array);
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


