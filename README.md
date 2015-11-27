## Captain Javascript

This is a fork of https://github.com/shancarter/Mr-Data-Converter

You can try it out right now at http://cr3ative.github.io/mr-data-converter/

Takes CSV or tab-delimited data from Excel and converts it into several web-friendly formats, include JSON and XML.

Features of Captain Javascript over Mr Data Converter:

* New output type: JSON - Text Row Array. This is useful for quickly creating clean JS arrays from Google Spreadsheets data. It tries to be more sensible with data type detection, and won't populate an array with blank entries; it also entirely ignores blank lines.
* Tweaked defaults to be a little "safer" by default
