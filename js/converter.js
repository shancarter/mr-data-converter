//
//  converter.js
//  Mr-CSV-Transformer
//
//  Created by Shan Carter as Mr-Data-Converter on 2010-09-01.
//
//  Forked by David Young as Mr-CSV-Transformer on 2014-05-31.
//


function DataConverter(nodeId) {

  //---------------------------------------
  // PUBLIC PROPERTIES
  //---------------------------------------

  this.nodeId                 = nodeId;
  this.node                   = $("#"+nodeId);

  this.outputDataTypes        = [
                                  {"text":"ActionScript",           "id":"as",               "notes":""},
                                  {"text":"ASP/VBScript",           "id":"asp",              "notes":""},
                                  {"text":"CSV",                    "id":"csv",              "notes":""},
                                  {"text":"HTML",                   "id":"html",             "notes":""},
                                  {"text":"JSON - Properties",      "id":"json",             "notes":""},
                                  {"text":"JSON - Column Arrays",   "id":"jsonArrayCols",    "notes":""},
                                  {"text":"JSON - Row Arrays",      "id":"jsonArrayRows",    "notes":""},
                                  {"text":"MySQL",                  "id":"mysql",            "notes":""},
                                  {"text":"PHP",                    "id":"php",              "notes":""},
                                  {"text":"Python - Dict",          "id":"python",           "notes":""},
                                  {"text":"Ruby",                   "id":"ruby",             "notes":""},
                                  {"text":"XML - Properties",       "id":"xmlProperties",    "notes":""},
                                  {"text":"XML - Nodes",            "id":"xml",              "notes":""},
                                  {"text":"XML - Illustrator",      "id":"xmlIllustrator",   "notes":""}
                                ];
  this.outputDataType         = "csv";
  this.outputFileExtension    = "csv";

  this.columnDelimiter        = "\t";
  this.rowDelimiter           = "\n";

  this.inputTextArea          = {};
  this.outputTextArea         = {};

  this.inputHeader            = {};
  this.outputHeader           = {};
  this.dataSelect             = {};

  this.inputText              = "";
  this.outputText             = "";
  this.headerNames            = "";

  this.newLine                = "\n";
  this.indent                 = "  ";

  this.commentLine            = "//";
  this.commentLineEnd         = "";
  this.tableName              = "MrCSVTransformer"

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

DataConverter.prototype.create = function(w,h,targets) {
  var self = this;

  //build HTML for converter
  this.inputHeader = $('<div class="groupHeader" id="inputHeader"><p class="groupHeadline">Input CSV or tab-delimited data. <span class="subhead"> Using Excel? Simply copy and paste. No data on hand? <a href="#" id="insertSample">Use sample</a></span></p></div>');
  this.inputTextArea = $('<textarea class="textInputs" id="dataInput"></textarea>');
  var outputHeaderText = '<div class="groupHeader" id="inputHeader">';
  outputHeaderText += '<p class="groupHeadline"><input id="btnSaveAs" type="button" value="Save Output" /> Output as <select name="Data Types" id="dataSelector" >';
  for (var i=0; i < this.outputDataTypes.length; i++) {
    outputHeaderText += '<option value="'+this.outputDataTypes[i]["id"]+'" '
            + (this.outputDataTypes[i]["id"] == this.outputDataType ? 'selected="selected"' : '')
            + '>'
            + this.outputDataTypes[i]["text"]+'</option>';
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

  this.outputTextArea.click(function(evt){this.select();});


  $("#insertSample").bind('click',function(evt){
    evt.preventDefault();
    self.insertSampleData();
    self.convert(targets);
    _gaq.push(['_trackEvent', 'SampleData','InsertGeneric']);
  });

  $("#dataInput").keyup(function() {self.convert(targets)});
  $("#dataInput").change(function() {
    self.convert(targets);
    _gaq.push(['_trackEvent', 'DataType',self.outputDataType]);
  });

  $("#dataSelector").bind('change',function(evt){
     self.outputDataType = $(this).val();
     self.convert(targets);
  });
     
  $("#settings").bind('change',function(evt){
     self.convert(targets);
  });

  this.resize(w,h);
}

DataConverter.prototype.resize = function(w,h) {

  var paneWidth = w;
  var paneHeight = (h-90)/2-20;

  this.node.css({width:paneWidth});
  this.inputTextArea.css({width:paneWidth-20,height:paneHeight});
  this.outputTextArea.css({width: paneWidth-20, height:paneHeight});

}

DataConverter.prototype.convert = function(targets) {

  this.inputText = this.inputTextArea.val();
  this.outputText = "";
  this.outputDataTypes = [
                          {"id":"as",               "extension":"as"},
                          {"id":"asp",              "extension":"asp"},
                          {"id":"csv",              "extension":"csv"},
                          {"id":"html",             "extension":"html"},
                          {"id":"json",             "extension":"json"},
                          {"id":"jsonArrayCols",    "extension":"json"},
                          {"id":"jsonArrayRows",    "extension":"json"},
                          {"id":"mysql",            "extension":"sql"},
                          {"id":"php",              "extension":"php"},
                          {"id":"python",           "extension":"py"},
                          {"id":"ruby",             "extension":"rb"},
                          {"id":"xmlProperties",    "extension":"xml"},
                          {"id":"xml",              "extension":"xml"},
                          {"id":"xmlIllustrator",   "extension":"xml"}
                        ];

  //make sure there is input data before converting...
  if (this.inputText.length > 0) {

    if (this.includeWhiteSpace) {
      this.newLine = "\n";
      // console.log("yes")
    } else {
      this.indent = "";
      this.newLine = "";
      // console.log("no")
    }

    CSVParser.resetLog();
    var parseOutput = CSVParser.parse(this.inputText, this.headersProvided, this.delimiter, this.downcaseHeaders, this.upcaseHeaders);
    //alert(typeof this.inputText);
    var dataGrid = parseOutput.dataGrid;
    var headerNames = parseOutput.headerNames;
    var headerTypes = parseOutput.headerTypes;
    var errors = parseOutput.errors;
    var intermediateText = DataGridRenderer["json"](dataGrid, headerNames, headerTypes, this.indent, this.newLine);
    var transformedText = '';
    
    if (targets.length != 0) {
      //var intermediateText = DataGridRenderer["json"](dataGrid, headerNames, headerTypes, this.indent, this.newLine);
      var mapping = [];
      
      mapping = addTextInputs(targets,headerNames);
      //alert('mapping='+mapping);
      transformedText = JSON.stringify(applyMap(targets,mapping,JSON.parse(intermediateText)));
      
      if (this.outputDataType == "json") {
        //Do nothing
      } 
      else 
      {
        transformedText = ConvertToCSV(transformedText);
        //alert(typeof transformedText);
        if (this.outputDataType != "csv") {
          parseOutput = CSVParser.parse(transformedText, this.headersProvided, this.delimiter, this.downcaseHeaders, this.upcaseHeaders);
      
          dataGrid = parseOutput.dataGrid;
          headerNames = parseOutput.headerNames;
          headerTypes = parseOutput.headerTypes;
          errors = parseOutput.errors;
      
          transformedText = DataGridRenderer[this.outputDataType](dataGrid, headerNames, headerTypes, this.indent, this.newLine);
        }
      }
    }
    else
    {
      if (this.outputDataType != "csv") {
        transformedText = DataGridRenderer[this.outputDataType](dataGrid, headerNames, headerTypes, this.indent, this.newLine);
      }
      else
      {
        transformedText = ConvertToCSV(intermediateText);
      }
    }

    this.outputText = transformedText;
    this.outputTextArea.val(errors + this.outputText);
    this.headerNames = headerNames;
    for (var i=0; i < this.outputDataTypes.length; i++) {
       if (this.outputDataTypes[i]["id"] == this.outputDataType) {
         this.outputFileExtension = this.outputDataTypes[i]["extension"];
         break;
       };
    };
    $("#btnSaveAs").click(SaveVarAsFile(this.outputTextArea.val(),this.outputFileExtension));
  }; //end test for existence of input text
}


DataConverter.prototype.insertSampleData = function() {
  this.inputTextArea.val("NAME\tVALUE\tCOLOR\tDATE\nAlan\t12\tblue\tSep. 25, 2009\nShan\t13\t\"green\tblue\"\tSep. 27, 2009\nJohn\t45\torange\tSep. 29, 2009\nMinna\t27\tteal\tSep. 30, 2009");
}


