//adapted from function on http://www.htmlforums.com/archive/index.php/t-10688.html
function SaveVarAsFile(someVar,extension){
  SaveFrame.document.open("text/html","replace");
  SaveFrame.document.write(someVar);
  SaveFrame.document.close();
  SaveFrame.focus();
  SaveFrame.document.execCommand('SaveAs',true,'MrCSVTransformer-output.'+extension);
}
