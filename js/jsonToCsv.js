// adapted from http://stackoverflow.com/questions/9767133/javascript-getting-all-existing-keys-in-a-json-array
function GetHeaders(jsonArray) {
    var L = jsonArray.length;
    if (L > 0) L = 1;
    for (var i = 0; i < L; i++) {
        var line = '';
        var obj = jsonArray[i];
        //alert('obj= ' + obj);
        for (var j in obj) {
            if (line != '') line += ',';
            //alert('j= '+j);
            if (j.indexOf(',') > -1) {
                j = '"' + j + '"';
            };
            line += j;
            //alert('line(part)='+line);
        }
    }
    //alert('line='+line);
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
            if (line != '') line += ',';
            if (array[i][index].indexOf(',') > -1) {
                array[i][index] = '"' + array[i][index] + '"';
            };
            line += array[i][index];
        }

        str += line;
        if (i < array.length - 1) str += '\r\n';
    }

    return str;
}


