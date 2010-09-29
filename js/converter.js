//
//  Mr. Data Converter
//
//  Created by Shan Carter on 2010-09-01.
//


function DataConverter(nodeId) {

  //---------------------------------------
  // PUBLIC PROPERTIES
  //---------------------------------------
  
  this.nodeId             = nodeId;
  this.node             = $("#"+nodeId);
  
  this.outputDataTypes        = [ 
                                {"text":"Actionscript","id":"as"},
                                {"text":"ASP/VBScript","id":"asp"},
                                {"text":"JSON","id":"json"},
                                {"text":"PHP","id":"php"},
                                {"text":"Ruby","id":"ruby"},
                                {"text":"XML","id":"xml"}];
  this.outputDataType         = this.outputDataTypes[0]["id"];
  
  this.columnDelimiter        = "\t";
  this.rowDelimiter            = "\n";
  
  this.inputTextArea          = {};
  this.outputTextArea         = {};
  
  this.inputHeader           = {};
  this.outputHeader         = {};
  this.dataSelect           = {};
  
  this.inputText            = "";
  this.outputText           = "";
  
  this.newLine            = "\n";
  this.indent             = "  ";
  
  this.useUnderscores         = true;
  this.headersProvided        = true;
  this.downcaseHeaders        = true;
  this.upcaseHeaders          = false;
  this.includeWhiteSpace      = true;
  this.useTabsForIndent       = false;
  
}

//---------------------------------------
// PUBLIC METHODS
//---------------------------------------

DataConverter.prototype.create = function(w,h) {
  var self = this;
  
  this.inputHeader = $('<div class="groupHeader" id="inputHeader"><p class="groupHeadline">Paste below</p></div>');
  this.inputTextArea = $('<textarea class="textInputs" id="dataInput"></textarea>');
  var outputHeaderText = '<div class="groupHeader" id="inputHeader"><p class="groupHeadline">Output as <select name="Data Types" id="dataSelector" >';
    for (var i=0; i < this.outputDataTypes.length; i++) {
      outputHeaderText += '<option value="'+this.outputDataTypes[i]["id"]+'">'+this.outputDataTypes[i]["text"]+'</option>';
    };
    outputHeaderText += '</select></p></div>';
  this.outputHeader = $(outputHeaderText);
  this.outputTextArea = $('<textarea class="textInputs" id="dataOutput"></textarea>');
  
  
  
  
  this.node.append(this.inputHeader);
  this.node.append(this.inputTextArea);
  this.node.append(this.outputHeader);
  this.node.append(this.outputTextArea);
  
  this.dataSelect = this.outputHeader.find("#dataSelector");
  
  
  //add event listeners
  $("#sampleData").bind('click', function(evt){
    evt.preventDefault();
    self.insertSampleData();
    self.convert();
  })
  
  $("#dataSelector").bind('change',function(evt){
    self.outputDataType = $(this).val();
    self.convert();
  })
  $("#convertButton").bind('click',function(evt){
    evt.preventDefault();
    self.convert();
  });
  
  $("#dataInput").change(this.convert)
  
  this.resize(w,h);
}

DataConverter.prototype.resize = function(w,h) {
  
  var paneWidth = w;
  var paneHeight = (h-90)/2;
  
  this.node.css({width:paneWidth});
  
  // this.inputHeader.css({width:paneWidth});
  this.inputTextArea.css({height:paneHeight});

  // this.outputHeader.css({width:paneWidth});
  this.outputTextArea.css({height:paneHeight});  
  
}

DataConverter.prototype.convert = function() {
  
  this.inputText = this.inputTextArea.val();
  this.outputText = "";
  
  
  //make sure there is input data before converting...
  if (this.inputText.length > 0) {
    
    
    
    if (this.includeWhiteSpace === true) {
      this.newLine = "\n";
    } else {
      this.indent = "";
      this.newLine = "";
    }
    
    var dataArray = [];
    
    var RE = new RegExp("[^,]", "gi");
    var numCommas = this.inputText.replace(RE, "").length;
    
    var RE = new RegExp("[^\t]", "gi");
    var numTabs = this.inputText.replace(RE, "").length;
    
    if (numTabs > numCommas) {this.columnDelimiter = "\t"}
    else {this.columnDelimiter = ","}
    
    var arr = this.inputText.split(this.rowDelimiter);
    
    var numRows = 0;
    var numColumns = 0;
    
    for (var i=0; i < arr.length; i++) {
      dataArray.push(arr[i].split(this.columnDelimiter));
    };
    
    var headers = [];
    var headerTypes = [];
    if (this.headersProvided) {
      headers = dataArray.splice(0,1)[0];
      for (var i=0; i < headers.length; i++) {
        t = headers[i].split(":")
        headers[i] = t[0]
        if (this.downcaseHeaders) {
          headers[i] = headers[i].toLowerCase();
        } 
        if (this.upcaseHeaders) {
          headers[i] = headers[i].toUpperCase();
        }
        
        if (this.useUnderscores) {
          headers[i] = headers[i].split(' ').join('_');
        };
        
        headers[i] = headers[i].split('-').join('_');
      
        headerTypes[i] = t[1];
      };
      numColumns = headers.length;
      numRows = dataArray.length;
    } else {
      numColumns = dataArray[0].length
      numRows = dataArray.length;
      for (var i=0; i < numColumns; i++) {
        headers.push("val"+String(i+1));
      };
    
    }
    
    
    //ACTIONSCRIPT
    if (this.outputDataType === "as") {
      this.outputText += "[";
      for (var i=0; i < numRows; i++) {
        var row = dataArray[i];
        this.outputText += "{";
        for (var j=0; j < numColumns; j++) {
          var rowOutput = '"'+row[j]+'"' ;          
          this.outputText += (headers[j] + ":" + rowOutput)
          if (j < (numColumns-1)) {this.outputText+=","};
        };
        this.outputText += "}";
        if (i < (numRows-1)) {this.outputText += ","+this.newLine};
      };
      this.outputText += "];";
    
    //ASP
    } else if (this.outputDataType === "asp") {
      for (var i=0; i < numRows; i++) {
        var row = dataArray[i];
        for (var j=0; j < numColumns; j++) {
          this.outputText += 'myArray('+j+','+i+') = "'+row[j]+'"'+this.newLine;        
        };
      };
      this.outputText = 'Dim myArray('+(j-1)+','+(i-1)+')'+this.newLine+this.outputText;
    
    
    
    //RUBY
    } else if (this.outputDataType === "ruby") {
      this.outputText += "[";
      for (var i=0; i < numRows; i++) {
        var row = dataArray[i];
        this.outputText += "{";
        for (var j=0; j < numColumns; j++) {
          var rowOutput = '"'+row[j]+'"' ;          
          this.outputText += ('"'+headers[j]+'"' + "=>" + rowOutput)
          if (j < (numColumns-1)) {this.outputText+=","};
        };
        this.outputText += "}";
        if (i < (numRows-1)) {this.outputText += ","+this.newLine};
      };
      this.outputText += "];";
    
      //PHP
    } else if (this.outputDataType === "php") {
      this.outputText += "array(" + this.newLine;
      for (var i=0; i < numRows; i++) {
        var row = dataArray[i];
        this.outputText += this.indent + "array(";
        for (var j=0; j < numColumns; j++) {
          var rowOutput = '"'+row[j]+'"' ;          
          this.outputText += ('"'+headers[j]+'"' + "=>" + rowOutput)
          if (j < (numColumns-1)) {this.outputText+=","};
        };
        this.outputText += ")";
        if (i < (numRows-1)) {this.outputText += ","+this.newLine};
      };
      this.outputText += this.newLine + ");";
    
      //JSON
    } else if (this.outputDataType === "json") {
      this.outputText += "[";
      for (var i=0; i < numRows; i++) {
        var row = dataArray[i];
        this.outputText += "{";
        for (var j=0; j < numColumns; j++) {
          var rowOutput = '"'+row[j]+'"' ;          
          this.outputText += ('"'+headers[j]+'"' + ":" + rowOutput)
          if (j < (numColumns-1)) {this.outputText+=","};
        };
        this.outputText += "}";
        if (i < (numRows-1)) {this.outputText += ","+this.newLine};
      };
      this.outputText += "];";
    
      //XML
    } else if (this.outputDataType === "xml"){
      this.outputText = '<?xml version="1.0" encoding="UTF-8"?>' + this.newLine;
      this.outputText += "<rows>"+this.newLine;
      for (var i=0; i < numRows; i++) {
        var row = dataArray[i];
        this.outputText += this.indent+"<row>"+this.newLine;
        for (var j=0; j < numColumns; j++) {
          this.outputText += this.indent+this.indent+'<'+headers[j]+'>';          
          this.outputText += row[j]
          this.outputText += '</'+headers[j]+'>'+this.newLine
        };
        this.outputText += this.indent+"</row>"+this.newLine;
      };
      this.outputText += "</rows>";
    }
    
    
    
    
    this.outputTextArea.val(this.outputText);
    
  }; //end test for existence of input text
}


DataConverter.prototype.insertSampleData = function() {
  this.inputTextArea.val("NAME\tVALUE\tCOLOR\nAlan\t12\tblue\nShan\t13\tgreen\nJoe\t45\torange");
  this.convert();
}