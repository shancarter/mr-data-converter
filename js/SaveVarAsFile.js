//adapted from function on http://www.htmlforums.com/archive/index.php/t-10688.html
function SaveVarAsFile(someVar,extension){
  var SaveFrame = frames['SaveFrame'].document;
  SaveFrame.open("text/html","replace");
  SaveFrame.write(someVar);
  SaveFrame.close();
  SaveFrame.focus();
  SaveFrame.execCommand('SaveAs',true,'MrCSVTransformer-output.'+extension);
}
