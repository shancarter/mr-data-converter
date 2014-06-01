function applymap(targets,mapping,input){
    var rtn= [];
    var hash = {};
    var mappedColumn;
    for (var i= 0; i < mapping.length; i++){
        var map = mapping[i];
        var column = Object.getOwnPropertyNames(map)[0];
        mappedColumn = map[column];
        hash[column] = mappedColumn;
    }

    for (var l=0; l< input.length; l++){
        var line = input[l];
        var mappedLine = {};
        for (var inputColumn in line)
        {
            if (targets.indexOf(inputColumn) >=0){
                mappedColumn = (hash[inputColumn] !== undefined) ? hash[inputColumn] : inputColumn;
                mappedLine[inputColumn] = line[mappedColumn];
            }
        }

        rtn[l] = mappedLine;
    }
    return rtn;
}
