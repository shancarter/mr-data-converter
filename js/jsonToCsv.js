// adapted from http://stackoverflow.com/questions/8430336/get-keys-of-json-object-in-javascript
function GetHeaders(obj) {
    if (typeof Object.keys !== "function") {
        (function() {
            Object.keys = Object_keys;
            function Object_keys(obj) {
                var keys = [], name;
                for (name in obj) {
                    if (obj.hasOwnProperty(name)) {
                        keys.push(name);
                    }
                }
                return keys;
            }
        })();
    }
    return Object.keys(obj);
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


