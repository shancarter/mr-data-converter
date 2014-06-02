function applyMap(targets,mapping,input){
    var rtn= [];
    //=======
    //Create a hashmap of all of the column mappings
    var hash = {};
    var mappedColumn;
    //Create a Hashmap of the mappings
    for (var i= 0; i < mapping.length; i++){
        var map = mapping[i];
        var column = Object.getOwnPropertyNames(map)[0];
        mappedColumn = map[column];
        hash[column] = mappedColumn;
    }

    for (var l=0; l< input.length; l++){
        var line = input[l];
        var mappedLine = [];
        for (var inputColumn in line)
        {
            //Find the mapping, and only apply it  in the correct order if it is part of the target
            mappedColumn = (hash[inputColumn] !== undefined) ? hash[inputColumn] : inputColumn;
            //allow no targets
            if (target.length != 0) {
                var targetIdx = targets.indexOf(mappedColumn);
    
                if (targetIdx >=0){
                    mappedLine[targetIdx] = {'mappedColumn': mappedColumn, 'value' :line[inputColumn]};
                }
            }
            else {
                mappedLine[targetIdx] = {'mappedColumn': mappedColumn, 'value' :line[inputColumn]};
            }
        }

        //Extract the JSON object, in the order needed
        var mappedLineObj = {};
        for (var o = 0 ; o < mappedLine.length; o++)
        {
            var obj = mappedLine[o];
            if (obj != undefined){
                mappedLineObj[obj.mappedColumn] = obj.value;
            }
        }

        //Return a line for line mapping
        rtn[l] = mappedLineObj;


    }
    //alert(JSON.stringify(rtn));
    return rtn;
}
