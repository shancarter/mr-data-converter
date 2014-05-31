function applymap(targets,mapping,input){
  var rtn= [];
  for (var l=0; l< input.length; l++){
    var line = input[l];
    var mappedLine = JSON.parse(JSON.stringify(line));
    for (var i= 0; i < mapping.length; i++){
      var map = mapping[i];
      var column = Object.getOwnPropertyNames(map)[0];
      var mappedColumn = map[column];
      var value = line[mappedColumn];
      mappedLine[column] = value;
    }
    rtn[l] = mappedLine;
  }
  return rtn;
}
