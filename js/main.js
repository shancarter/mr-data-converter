var sampleData = "name\tvalue\tcolor\tdate\nAlan\t12\tblue\tSep. 25, 2009\nShan\t13\tblue\tSep. 27, 2009\nDavid\t45\torange\tSep. 29, 2009\nMinna\t27\tteal\tSep. 30, 2009";
var sampleCode = "d3.nest()\n  .key(function(d) { return d.color; })\n  .entries(data);";

// total population by year
// d3.nest()
  // .key(function(d) { return d.year; })
  // .key(function(d) { return d.fips; })
  // .rollup(function(values) { return d3.sum(values, function(d) {return d.totalpop; }) })
  // .map(data);



var html = d3.select("#converter");

var left = html.append("div")
    .classed("left", true);

var input = left.append("div")
    .classed("input", true);

input.append("h3")
    .text("Input CSV or TSV");

input.append("textarea");

var code = left.append("div")
    .classed("code", true);

code.append("h3")
    .text("Code");

code.append("textarea");

var right = html.append("div")
    .classed("right", true);

var output = right.append("div")
    .classed("output", true);

output.append("button")
    .text("Update Output")
    .on("click", update);

output.append("textarea");

input.select("textarea")
    .property("value", sampleData);

code.select("textarea")
    .property("value", sampleCode);

update();

function update() {
  var t = input.select("textarea")
      .property("value");

  var c = code.select("textarea")
      .property("value");

  var data = d3.tsv.parse(t);

  var out = eval(c);

  output.select("textarea")
      .property("value", JSON.stringify(out, false, 2));
}