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
  this.node               = $("#"+nodeId);
  
  this.outputDataTypes        = [ 
                                {"text":"Actionscript",       "id":"as",              "notes":""},
                                {"text":"ASP/VBScript",       "id":"asp",             "notes":""},
                                {"text":"HTML",               "id":"html",            "notes":""},
                                {"text":"JSON - Properties",  "id":"json",            "notes":""},
                                {"text":"JSON - Arrays",      "id":"jsonArray",       "notes":""},
                                {"text":"PHP",                "id":"php",             "notes":""},
                                {"text":"Ruby",               "id":"ruby",            "notes":""},
                                {"text":"XML - Properties",   "id":"xmlProperties",   "notes":""},
                                {"text":"XML - Nodes",        "id":"xmlNodes",        "notes":""}];
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
  
  this.errorLog           = "";
  this.commentLine        = "//";
  this.commentLineEnd        = "";
  
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
  
  //build HTML for converter
  this.inputHeader = $('<div class="groupHeader" id="inputHeader"><p class="groupHeadline">Input CSV or tab-delimited data. <span class="subhead"> Using Excel? Simply copy and paste. No data on hand? <a href="#" id="insertSample">Use sample</a></span></p></div>');
  this.inputTextArea = $('<textarea class="textInputs" id="dataInput"></textarea>');
  var outputHeaderText = '<div class="groupHeader" id="inputHeader"><p class="groupHeadline">Output as <select name="Data Types" id="dataSelector" >';
    for (var i=0; i < this.outputDataTypes.length; i++) {
      outputHeaderText += '<option value="'+this.outputDataTypes[i]["id"]+'">'+this.outputDataTypes[i]["text"]+'</option>';
    };
    outputHeaderText += '</select><span class="subhead" id="outputNotes"></span></p></div>';
  this.outputHeader = $(outputHeaderText);
  this.outputTextArea = $('<textarea class="textInputs" id="dataOutput"></textarea>');
  
  this.node.append(this.inputHeader);
  this.node.append(this.inputTextArea);
  this.node.append(this.outputHeader);
  this.node.append(this.outputTextArea);
  
  this.dataSelect = this.outputHeader.find("#dataSelector");
  
  
  //add event listeners
  
  // $("#convertButton").bind('click',function(evt){
  //   evt.preventDefault();
  //   self.convert();
  // });
  
  $("#insertSample").bind('click',function(evt){
    evt.preventDefault();
    self.insertSampleData();
    self.convert();
  });
  
  $("#dataInput").keyup(function() {self.convert()});
  $("#dataInput").change(function() {self.convert()});
  
  $("#dataSelector").bind('change',function(evt){
       self.outputDataType = $(this).val();
       self.convert();
     });
  
  this.resize(w,h);
}

DataConverter.prototype.resize = function(w,h) {
  
  var paneWidth = w;
  var paneHeight = (h-90)/2;
  
  this.node.css({width:paneWidth});
  this.inputTextArea.css({height:paneHeight});
  this.outputTextArea.css({height:paneHeight});  
  
}

DataConverter.prototype.convert = function() {
  
  this.resetLog();

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
    
    //test for delimiter
    //count the number of commas
    var RE = new RegExp("[^,]", "gi");
    var numCommas = this.inputText.replace(RE, "").length;
    
    //count the number of tabs
    var RE = new RegExp("[^\t]", "gi");
    var numTabs = this.inputText.replace(RE, "").length;
    
    //set delimiter
    if (numTabs > numCommas) {this.columnDelimiter = "\t"}
    else {this.columnDelimiter = ","}
    
    
    var arr = this.inputText.split(this.rowDelimiter);
    
    for (var i=0; i < arr.length; i++) {
      dataArray.push(arr[i].split(this.columnDelimiter));
    };
    
    
    
    var headers = [];
    var headerTypes = [];
    var headerNotes = [];
    var numColumns = dataArray[0].length;
    var numRows = dataArray.length;
    if (this.headersProvided) {
      
      //remove header row
      headers = dataArray.splice(0,1)[0];
      numRows = dataArray.length;
      
      for (var i=0; i < headers.length; i++) {
        
        //remove and record header notes
        t = headers[i].split(":");
        headers[i] = t[0];
        if (t[1]) {
          headerNotes[i] = t[1].toLowerCase();
        } else {
          headerNotes[i] = "";
        }
        
        //apply header transforms
        if (this.downcaseHeaders) {
          headers[i] = headers[i].toLowerCase();
        } 
        if (this.upcaseHeaders) {
          headers[i] = headers[i].toUpperCase();
        }
        if (this.useUnderscores) {
          headers[i] = headers[i].split(' ').join('_');
        };
        
        //remove unwanted characters from headers
        headers[i] = headers[i].split('-').join('_');
      };
      
    } else { //if no headers provided
      
      //create generic property names
      for (var i=0; i < numColumns; i++) {
        headers.push("val"+String(i));
        headerTypes.push("");
        headerNotes.push("");
      };
    
    }
    
    //test all the rows for proper number of columns.
    for (var i=0; i < dataArray.length; i++) {
      var numValues = dataArray[i].length;
      if (numValues != numColumns) {this.log("Error parsing row "+String(i)+". Wrong number of columns.")};
    };
    
    //test columns for number data type
    var numRowsToTest = Math.min(4,numColumns);
    for (var i=0; i < headers.length; i++) {
      var n = true;
      for (var r=0; r < numRowsToTest; r++) {
        if (!this.isNumber(dataArray[r][i])) { n = false };
      };
      if (n) {headerTypes[i] = "number"};
    }
    
    
    //Begin Rendering
    //ACTIONSCRIPT
    if (this.outputDataType === "as") {
      this.commentLine = "//";
      this.commentLineEnd = "";
      this.outputText += "[";
      for (var i=0; i < numRows; i++) {
        var row = dataArray[i];
        this.outputText += "{";
        for (var j=0; j < numColumns; j++) {
          if (headerTypes[j] === "number") {
            var rowOutput = row[j];
          } else {
            var rowOutput = '"'+row[j]+'"';
          };      
          this.outputText += (headers[j] + ":" + rowOutput)
          if (j < (numColumns-1)) {this.outputText+=","};
        };
        this.outputText += "}";
        if (i < (numRows-1)) {this.outputText += ","+this.newLine};
      };
      this.outputText += "];";
    
    //ASP
    } else if (this.outputDataType === "asp") {
      this.commentLine = "'";
      this.commentLineEnd = "";
      for (var i=0; i < numRows; i++) {
        var row = dataArray[i];
        for (var j=0; j < numColumns; j++) {
          if (headerTypes[j] === "number") {
            var rowOutput = row[j];
          } else {
            var rowOutput = '"'+row[j]+'"';
          };
          this.outputText += 'myArray('+j+','+i+') = '+rowOutput+this.newLine;        
        };
      };
      this.outputText = 'Dim myArray('+(j-1)+','+(i-1)+')'+this.newLine+this.outputText;
    
    //HTML
    } else if (this.outputDataType === "html"){
      this.commentLine = "<!--";
      this.commentLineEnd = "-->";
      this.outputText += "<table>"+this.newLine;
      this.outputText += this.indent+"<thead>"+this.newLine;
      this.outputText += this.indent+this.indent+"<tr>"+this.newLine;
      for (var j=0; j < numColumns; j++) {
        this.outputText += this.indent+this.indent+this.indent+'<th class="'+headers[j]+'-cell">';          
        this.outputText += headers[j]
        this.outputText += '</th>'+this.newLine
      };
      this.outputText += this.indent+this.indent+"</tr>"+this.newLine;
      this.outputText += this.indent+"</thead>"+this.newLine;
      this.outputText += this.indent+"<tbody>"+this.newLine;
      for (var i=0; i < numRows; i++) {
        var row = dataArray[i];
        var rowClassName = ""
        if (i === numRows-1) {
          rowClassName = ' class="lastRow"';
        } else if (i === 0){
          rowClassName = ' class="firstRow"';
        }
        this.outputText += this.indent+this.indent+"<tr"+rowClassName+">"+this.newLine;
        for (var j=0; j < numColumns; j++) {
          this.outputText += this.indent+this.indent+this.indent+'<td class="'+headers[j]+'-cell">';          
          this.outputText += row[j]
          this.outputText += '</td>'+this.newLine
        };
        this.outputText += this.indent+this.indent+"</tr>"+this.newLine;
      };
      this.outputText += this.indent+"</tbody>"+this.newLine;
      this.outputText += "</table>";
  
    
    //RUBY
    } else if (this.outputDataType === "ruby") {
      this.commentLine = "#";
      this.commentLineEnd = "";
      this.outputText += "[";
      for (var i=0; i < numRows; i++) {
        var row = dataArray[i];
        this.outputText += "{";
        for (var j=0; j < numColumns; j++) {
          if (headerTypes[j] === "number") {
            var rowOutput = row[j];
          } else {
            var rowOutput = '"'+row[j]+'"';
          };         
          this.outputText += ('"'+headers[j]+'"' + "=>" + rowOutput)
          if (j < (numColumns-1)) {this.outputText+=","};
        };
        this.outputText += "}";
        if (i < (numRows-1)) {this.outputText += ","+this.newLine};
      };
      this.outputText += "];";
    
      //PHP
    } else if (this.outputDataType === "php") {
      this.commentLine = "//";
      this.commentLineEnd = "";
      this.outputText += "array(" + this.newLine;
      for (var i=0; i < numRows; i++) {
        var row = dataArray[i];
        this.outputText += this.indent + "array(";
        for (var j=0; j < numColumns; j++) {
          if (headerTypes[j] === "number") {
            var rowOutput = row[j];
          } else {
            var rowOutput = '"'+row[j]+'"';
          };          
          this.outputText += ('"'+headers[j]+'"' + "=>" + rowOutput)
          if (j < (numColumns-1)) {this.outputText+=","};
        };
        this.outputText += ")";
        if (i < (numRows-1)) {this.outputText += ","+this.newLine};
      };
      this.outputText += this.newLine + ");";
    
      //JSON - properties
    } else if (this.outputDataType === "json") {
      this.commentLine = "//";
      this.commentLineEnd = "";
      this.outputText += "[";
      for (var i=0; i < numRows; i++) {
        var row = dataArray[i];
        this.outputText += "{";
        for (var j=0; j < numColumns; j++) {
          if (headerTypes[j] === "number") {
            var rowOutput = row[j];
          } else {
            var rowOutput = '"'+row[j]+'"';
          };
          
        this.outputText += ('"'+headers[j] +'"' + ":" + rowOutput );
          
          if (j < (numColumns-1)) {this.outputText+=","};
        };
        this.outputText += "}";
        if (i < (numRows-1)) {this.outputText += ","+this.newLine};
      };
      this.outputText += "];";
    
    
        //JSON - array
      } else if (this.outputDataType === "jsonArray") {
        this.commentLine = "//";
        this.commentLineEnd = "";
        this.outputText += "[";
        for (var i=0; i < numColumns; i++) {
          this.outputText += "[";
          for (var j=0; j < numRows; j++) {
            if (headerTypes[i] == "number") {
              this.outputText += dataArray[j][i];
            } else {
              this.outputText += '"'+dataArray[j][i]+'"' ;
            }
            
            
            if (j < (numColumns-1)) {this.outputText+=","};
          };
          this.outputText += "]";
          if (i < (numRows-1)) {this.outputText += ","+this.newLine};
        };
        this.outputText += "];";

    
      //XML - nodes
    } else if (this.outputDataType === "xmlNodes"){
      
      
      this.commentLine = "<!--";
      this.commentLineEnd = "-->";
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
    
    
    
      //XML properties
    } else if (this.outputDataType === "xmlProperties"){
      
      this.commentLine = "<!--";
      this.commentLineEnd = "-->";
      this.outputText = '<?xml version="1.0" encoding="UTF-8"?>' + this.newLine;
      this.outputText += "<rows>"+this.newLine;
      for (var i=0; i < numRows; i++) {
        var row = dataArray[i];
        this.outputText += this.indent+"<row ";
        for (var j=0; j < numColumns; j++) {
          this.outputText += headers[j]+'=';          
          this.outputText += '"' + row[j] + '" ';
        };
        this.outputText += "></row>"+this.newLine;
      };
      this.outputText += "</rows>";
    }
    
    this.outputTextArea.val(this.getLog()+this.outputText);
    
  }; //end test for existence of input text
}


DataConverter.prototype.insertSampleData = function() {
  this.inputTextArea.val("NAME\tVALUE\tCOLOR\nAlan\t12\tblue\nShan\t13\tgreen\nJoe\t45\torange");
}

DataConverter.prototype.resetLog = function() {
  this.errorLog = "";
}

DataConverter.prototype.log = function(l) {
  this.errorLog += (String(l) + "<EOL>" );
}

DataConverter.prototype.getLog = function(l) {
  if (this.errorLog.length > 0) {
    var arr = this.errorLog.split("<EOL>");
    var out = "";
    for (var i=0; i < arr.length-1; i++) {
      out += (this.commentLine + arr[i] + this.commentLineEnd+"\n");
    };
    return (this.commentLine + "ERRORS"+this.commentLineEnd+"\n" + out + "\n")
  } else {
    return ""
  }
  this.errorLog += ( this.commentLine+String(l) + "\n" );
}


DataConverter.prototype.isNumber = function(string) {
  if( (string == null) || isNaN( new Number(string) ) ) {
    return false;
  }
  return true;
}