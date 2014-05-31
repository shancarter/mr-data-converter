
describe('applymap',function(){
    it('reverses columns correctly',function(){
	var mapping = { 'targets': ['A','B','C'],
			'map': [{ 'A': 'C'}, {'C': 'A'}]};
	var input = [{'A':1,'B':2,'C':3}];
	var output = applymap(mapping,input);
	var expected = [{'A':3,'B':2,'C':1}];
	expect(output).toBe(expected)
	});
});


