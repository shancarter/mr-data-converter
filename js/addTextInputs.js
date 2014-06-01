function addTextInputs(targets){
  $(document).ready(function() {
    var InputsWrapper   = $("#InputsWrapper"); //Input boxes wrapper ID
    
    $(InputsWrapper).html("");
    for (i = 0; i < targets.length; i++) {
      $(InputsWrapper).append('Target ' + (i+1).toString() + ':<input style="width: 50%" type="text" id="target_' + i.toString() + '" value="' + targets[i] + '" readonly /><br />');
      $(InputsWrapper).append('Mapping ' + (i+1).toString() + ':<select style="width: 50%" id="mapping_' + i.toString() + '">');
      $(InputsWrapper).append('</select><br /><br />');
    };
    return false;
  });
}
