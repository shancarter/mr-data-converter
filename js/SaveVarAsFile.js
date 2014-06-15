//adapted from function on http://lalp.googlecode.com/svn-history/r29/trunk/WebContent/index.jsp
function SaveVarAsFile(someVar){
	function dataUrl(data) {
	    return "data:x-application/text," + escape(data.replace(/\r?\n/g,"\r\n"));
	}
	if("\v"=="v"){
	    var d= document.open("text/plain");
	    d.write(someVar);
	    d.execCommand( "saveAs", true, location.href.split("/").reverse()[0]);
	    d.close();
	    return;
	}
	window.open(dataUrl(someVar));
}
