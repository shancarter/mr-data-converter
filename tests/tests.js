//hellow world for tests

test("Basic tests", function() {
  expect(13);
  ok( jQuery, "jQuery" );
  ok( $, "$" );
  ok( updateSettings, "updateSettings" );
  ok( DataConverter.prototype.insertSampleData, "insertSampleData" );
  ok( DataConverter.prototype.convert, "convert" );
  ok( DataConverter.prototype.resize, "resize" );
  ok( DataConverter.prototype.create, "create" );
  ok( CSVParser, "csvparser" );
  ok( DataGridRenderer, "DataGridRenderer" );
  ok( d, "d" );
  equals( d.outputDataType, "xml", "d.outputDataType === xml" );
  ok( d.convert, "d.convert" );
  ok( DataGridRenderer.html, "DataGridRenderer.html" );
});

test("CSVParser", function() {
  expect(6);
  try {
    CSVParser.resetLog();
    var parseOutput = CSVParser.parse( "NAME\tVALUE\tCOLOR\tDATE\nAlan\t12\tblue\tSep. 25, 2009\nShan\t13\t\"green\tblue\"\tSep. 27, 2009\nJohn\t45\torange\tSep. 29, 2009\nMinna\t27\tteal\tSep. 30, 2009", true );
    var dataGrid = parseOutput.dataGrid;
    var headerNames = parseOutput.headerNames;
    var headerTypes = parseOutput.headerTypes;
    var errors = parseOutput.errors;
  } catch(e) {
    delete parseOutput;
    delete dataGrid;
    delete headerNames;
    delete headerTypes;
  }
  ok( parseOutput, "parseOutput" );
  ok( dataGrid, "dataGrid" );
  ok( !errors, "errors" );
  same( headerNames, [ "NAME", "VALUE", "COLOR", "DATE" ], "headerNames" );
  same( headerTypes,  [ "string", "int", "string", "string" ], "headerTypes");
  try {
    CSVParser.resetLog();
    var parseOutput = CSVParser.parse( "foo\tbar\nfoobar" );
    var errors = parseOutput.errors;
  } catch(e) {
    // handle CSVParser errors
  }
  ok( errors, "catches invalid csv");
});

test("DataGridRenderer", function() {
  expect(12);
  try {
    CSVParser.resetLog();
    var parseOutput = CSVParser.parse( "NAME\tVALUE\tCOLOR\tDATE\nAlan\t12\tblue\tSep. 25, 2009\nShan\t13\t\"green\tblue\"\tSep. 27, 2009\nJohn\t45\torange\tSep. 29, 2009\nMinna\t27\tteal\tSep. 30, 2009", true );
    var dataGrid = parseOutput.dataGrid;
    var headerNames = parseOutput.headerNames;
    var headerTypes = parseOutput.headerTypes;
    var errors = parseOutput.errors;
  } catch(e) {
    // failure
    ok( errors, "csv parsing failed");
  }
  ok( DataGridRenderer["as"](dataGrid, headerNames, headerTypes, true, true), "DataGridRenderer[as]");
  ok( DataGridRenderer["asp"](dataGrid, headerNames, headerTypes, true, true), "DataGridRenderer[asp]");
  ok( DataGridRenderer["html"](dataGrid, headerNames, headerTypes, true, true), "DataGridRenderer[html]");
  ok( DataGridRenderer["json"](dataGrid, headerNames, headerTypes, true, true), "DataGridRenderer[json]");
  ok( DataGridRenderer["jsonArrayCols"](dataGrid, headerNames, headerTypes, true, true), "DataGridRenderer[jsonArrayCols]");
  ok( DataGridRenderer["jsonArrayRows"](dataGrid, headerNames, headerTypes, true, true), "DataGridRenderer[jsonArrayRows]");
  ok( DataGridRenderer["mysql"](dataGrid, headerNames, headerTypes, true, true), "DataGridRenderer[mysql]");
  ok( DataGridRenderer["php"](dataGrid, headerNames, headerTypes, true, true), "DataGridRenderer[php]");
  ok( DataGridRenderer["python"](dataGrid, headerNames, headerTypes, true, true), "DataGridRenderer[python]");
  ok( DataGridRenderer["ruby"](dataGrid, headerNames, headerTypes, true, true), "DataGridRenderer[ruby]");
  ok( DataGridRenderer["xml"](dataGrid, headerNames, headerTypes, true, true), "DataGridRenderer[xml]");
  ok( DataGridRenderer["xmlProperties"](dataGrid, headerNames, headerTypes, true, true), "DataGridRenderer[xmlProperties]");
});
