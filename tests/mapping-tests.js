describe('applyMap',function(){
    it('swaps',function(){
        var targets = ['X','Y','Z'];
        var mapping = [{'A':'Z'}];
        var input = [{'A':1,'B':2,'C':3}];
        var output = applyMap(targets, mapping,input);
        var expected = [{'Z':1}];
        expect(output).toEqual(expected);
    });

    it('swaps full and in order, leaving out non-targets',function(){
        var targets = ['X','Y','Z'];
        var mapping = [{'A':'Z'}, {'C':'Y'}, {'B':'X'}];
        var input = [{'A':1,'B':2,'C':3,'D':4}];
        var output = applyMap(targets, mapping,input);
        var expected = [{'X':2, 'Y':3, 'Z':1}];
        expect(output).toEqual(expected);
    });

    it('no targets',function(){
        var targets = [];
        var mapping = [{'A':'C'}];
        var input = [{'A':1,'B':2,'C':3}];
        var output = applyMap(targets, mapping,input);
        var expected = [{}];
        expect(output).toEqual(expected);
    });
});
