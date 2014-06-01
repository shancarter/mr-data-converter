describe('applymap',function(){
    it('reverses columns correctly',function(){
        var targets = ['A','B','C'];
        var mapping = [{'A':'C'}, {'C':'A'}];
        var input = [{'A':1,'B':2,'C':3}];
        var output = applymap(targets, mapping,input);
        var expected = [{'A':3,'B':2,'C':1}];
        expect(output).toEqual(expected);
    });

    it('ignores non mapped fields',function(){
        var targets = ['A','C'];
        var mapping = [{'A':'C'}, {'C':'A'}];
        var input = [{'A':1,'B':2,'C':3}];
        var output = applymap(targets, mapping,input);
        var expected = [{'A':3,'C':1}];
        expect(output).toEqual(expected);
    });

    it('not bi-directional mapping',function(){
        var targets = ['A','B','C'];
        var mapping = [{'A':'C'}];
        var input = [{'A':1,'B':2,'C':3}];
        var output = applymap(targets, mapping,input);
        var expected = [{'A':3,'B':2,'C':3}];
        expect(output).toEqual(expected);
    });

    it('no targets',function(){
        var targets = [];
        var mapping = [{'A':'C'}];
        var input = [{'A':1,'B':2,'C':3}];
        var output = applymap(targets, mapping,input);
        var expected = [];
        expect(output).toEqual(expected);
    });
});
