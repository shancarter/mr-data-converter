// 
//  CSVParser.js
//  Mr-Data-Converter
//  
//  Created by Shan Carter on 2010-10-18.
//  Input CSV or Tab-delimited data and this will parse it into a Data Grid Javascript object
// 


var CSVParser = {
  
  //---------------------------------------
  // UTILS
  //---------------------------------------
  
  isNumber: function(string) {
    if( (string == null) || isNaN( new Number(string) ) ) {
      return false;
    }
    return true;
  },
  
  
  //---------------------------------------
  // PARSE
  //---------------------------------------
  
  parse: function (input, headersIncluded) {
    
    var dataArray = [];
    
    var errors = [];
    
    
    
    //test for delimiter
    //count the number of commas
    var RE = new RegExp("[^,]", "gi");
    var numCommas = input.replace(RE, "").length;
    
    //count the number of tabs
    RE = new RegExp("[^\t]", "gi");
    var numTabs = input.replace(RE, "").length;
    
    var rowDelimiter = "\n";
    //set delimiter
    var columnDelimiter = ",";
    if (numTabs > numCommas) {
      columnDelimiter = "\t"
    };
    
    
    // kill extra empty lines
    RE = new RegExp("^" + rowDelimiter + "+", "gi");
    input = input.replace(RE, "");
    RE = new RegExp(rowDelimiter + "+$", "gi");
    input = input.replace(RE, "");
    
    var arr = input.split(rowDelimiter);
    
    for (var i=0; i < arr.length; i++) {
      dataArray.push(arr[i].split(columnDelimiter));
    };
    
    
    
    var headerNames = [];
    var headerTypes = [];
    var numColumns = dataArray[0].length;
    var numRows = dataArray.length;
    if (headersIncluded) {
      
      //remove header row
      headerNames = dataArray.splice(0,1)[0];
      numRows = dataArray.length;
      
    } else { //if no headerNames provided
      
      //create generic property names
      for (var i=0; i < numColumns; i++) {
        headerNames.push("val"+String(i));
        headerTypes.push("");
      };
    
    }
    
    //test all the rows for proper number of columns.
    for (var i=0; i < dataArray.length; i++) {
      var numValues = dataArray[i].length;
      if (numValues != numColumns) {this.log("Error parsing row "+String(i)+". Wrong number of columns.")};
    };
    
    //test columns for number data type
    var numRowsToTest = numColumns;
    var threshold = 0.5;
    for (var i=0; i < headerNames.length; i++) {
      var numFloats = 0;
      var numInts = 0;
      for (var r=0; r < numRowsToTest; r++) {
        if (CSVParser.isNumber(dataArray[r][i])) {
          numInts++
          if (String(dataArray[r][i]).indexOf(".") > 0) {
            numFloats++
          }
        };
      };
      
      if ((numInts / numRowsToTest) > threshold){
        if (numFloats > 0) {
          headerTypes[i] = "float"
        } else {
          headerTypes[i] = "int"
        }
      } else {
        headerTypes[i] = "string"
      }
    }
    
    
    
    
    
    return {'dataGrid':dataArray, 'headerNames':headerNames, 'headerTypes':headerTypes, 'errors':this.getLog()}
    
  },
  
  
  //---------------------------------------
  // ERROR LOGGING
  //---------------------------------------
  errorLog:[],
  
  resetLog: function() {
    this.errorLog = [];
  },

  log: function(l) {
    this.errorLog.push(l);
  },

  getLog: function() {
    var out = "";
    if (this.errorLog.length > 0) {
      for (var i=0; i < this.errorLog.length; i++) {
        out += ("!!"+this.errorLog[i] + "!!\n");
      };
      out += "\n"
    };
    
    return out;
  }
  


}