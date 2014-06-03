function addTextInputs(targets,headerNames){
  $(document).ready(function() {
    var InputsWrapper   = $("#InputsWrapper"); //Input boxes wrapper ID
    var boolSelected = false;
    var mapping = [];
    for (k = 0; k < targets.length; k++) {
      if ($("select[id='mapping_" + k.toString() + "']").length != 0 & $("select[id='mapping_" + k.toString() + "'] option:selected").index() != 0) {
        boolSelected = true;
        mapping.push({$("#mapping_" + k.toString()).val() : $("#target_" + k.toString()).text() })
      }
    }
    
    if (boolSelected == false) {
      $(InputsWrapper).html("");
      var headerOptions = "<option value=''>-- No mapping --</option>\r\n";
      for (j = 0; j < headerNames.length; j++) {
          headerOptions += "  <option value='" + headerNames[j].toString().replace(/</g, '&lt;').replace(/>/g, '&gt;')  + "'>" + headerNames[j].toString().replace(/</g, '&lt;').replace(/>/g, '&gt;') + "</option>\r\n";
      }
      var strInputs = "<table><tr><td>Targets</td><td>Mapping</td></tr>";
      for (i = 0; i < targets.length; i++) {
        strInputs += '<tr><td><input type="text" id="target_' + i.toString() + '" value="' + targets[i].toString().replace(/</g, '&lt;').replace(/>/g, '&gt;') + '" readonly /></td>' 
          + '<td><select id="mapping_' + i.toString() + '">'
          + headerOptions
          + '</select></td></tr>';
      };
      strInputs += '</table>';
      $(InputsWrapper).append(strInputs);
    };
    return mapping;
  });
}
