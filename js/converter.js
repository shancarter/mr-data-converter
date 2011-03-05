// 
//  converter.js
//  Mr-Data-Converter
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
                                {"text":"Actionscript",           "id":"as",               "notes":""},
                                {"text":"ASP/VBScript",           "id":"asp",              "notes":""},
                                {"text":"HTML",                   "id":"html",             "notes":""},
                                {"text":"JSON - Properties",      "id":"json",             "notes":""},
                                {"text":"JSON - Column Arrays",   "id":"jsonArrayCols",    "notes":""},
                                {"text":"JSON - Row Arrays",      "id":"jsonArrayRows",    "notes":""},
                                {"text":"MySQL",                  "id":"mysql",            "notes":""},
                                {"text":"PHP",                    "id":"php",              "notes":""},
                                {"text":"Python - Dict",          "id":"python",           "notes":""},
                                {"text":"Ruby",                   "id":"ruby",             "notes":""},
                                {"text":"XML - Properties",       "id":"xmlProperties",    "notes":""},
                                {"text":"XML - Nodes",            "id":"xml",              "notes":""}];
  this.outputDataType         = "xml";
  
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
  
  this.commentLine        = "//";
  this.commentLineEnd        = "";
  this.tableName          = "MrDataConverter"
  
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
  
  this.outputTextArea.click(function(evt){this.select();console.log("click")});
  
  
  $("#insertSample").bind('click',function(evt){
    evt.preventDefault();
    self.insertSampleData();
    self.convert();
    _gaq.push(['_trackEvent', 'SampleData','InsertGeneric']);
  });
  
  $("#dataInput").keyup(function() {self.convert()});
  $("#dataInput").change(function() {
    self.convert();
    _gaq.push(['_trackEvent', 'DataType',self.outputDataType]);
  });
  
  $("#dataSelector").bind('change',function(evt){
       self.outputDataType = $(this).val();
       self.convert();
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
    
    CSVParser.resetLog();
    var parseOutput = CSVParser.parse(this.inputText, this.headersProvided);
    
    var dataGrid = parseOutput.dataGrid;
    var headerNames = parseOutput.headerNames;
    var headerTypes = parseOutput.headerTypes;
    var errors = parseOutput.errors;
      
    this.outputText = DataGridRenderer[this.outputDataType](dataGrid, headerNames, headerTypes, this.indent, this.newLine);
    
    
    
    this.outputTextArea.val(errors + this.outputText);
    
  }; //end test for existence of input text
}


DataConverter.prototype.insertSampleData = function() {
  this.inputTextArea.val("NAME\tVALUE\tCOLOR\tDATE\nAlan\t12\tblue\tSep. 25, 2009\nShan\t13\t\"green\tblue\"\tSep. 27, 2009\nJohn\t45\torange\tSep. 29, 2009\nMinna\t27\tteal\tSep. 30, 2009");
}

    var widthOffset = 345;
    var heightOffset = 35
    
    var d = new DataConverter('converter');
    
    var sidebar = $('#header');
    
    var win = $(window);
    var w = win.width() - widthOffset;
    var h = win.height() - heightOffset;
    
    d.create(w,h);
      
    $(".settingsElement").change(updateSettings);
    
    $(window).bind('resize',function() {  
      
        w = win.width() - widthOffset;
        h = win.height() - heightOffset;
        d.resize(w,h);
        sidebar.height(h);
      
      });
    
    function updateSettings (evt) {
      var _gaq = _gaq || [];
      if (evt) {
        _gaq.push(['_trackEvent', 'Settings',evt.currentTarget.id ]);
      };
      
      d.includeWhiteSpace = $('#includeWhiteSpaceCB').attr('checked');
      
      if (d.includeWhiteSpace) {
        $("input[name=indentType]").removeAttr("disabled");
        var indentType = $('input[name=indentType]:checked').val();
        if (indentType === "tabs") {
          d.indent = "\t";
        } else if (indentType === "spaces") {
          d.indent = "  "
        }
      } else {
        $("input[name=indentType]").attr("disabled", "disabled");
      }
      
      d.headersProvided = $('#headersProvidedCB').attr('checked');
      
      if (d.headersProvided) {
        $("input[name=headerModifications]").removeAttr("disabled");
        
        var hm = $('input[name=headerModifications]:checked').val();
        
        if (hm === "downcase") {
          d.downcaseHeaders = true;
          d.upcaseHeaders = false;
        } else if (hm === "upcase") {
          d.downcaseHeaders = false;
          d.upcaseHeaders = true;
        } else if (hm === "none") {
          d.downcaseHeaders = false;
          d.upcaseHeaders = false;
        }
      } else {
        $("input[name=headerModifications]").attr("disabled", "disabled");
      }
      
      d.useUnderscores = true;
      
      
      d.convert();
    };
    
    updateSettings();
    
