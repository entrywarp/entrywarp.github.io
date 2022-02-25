var DString = function(d){
    this.d = d;
};

DString.prototype.format = function(q){
    return this.d.replace(/\{[\s]*\}/g, q);
};

var formatStr = function(a, b){
    return a.replace(/\{[\s]*\}/g, b);
};

/**
 * 
 * @param {Compiler} comp 
 */

var Pixer = function(comp){
    this.comp = comp;
    this.first = "https://api.allorigins.win?url={}";
    this.DPI = 3;
};

Pixer.prototype.load = function(){
    var img = [], snd = [];
    const cp = this.comp;
    for(var i in cp.ids){
        var c = cp.ids[i];
        if(c instanceof EntryPic){
            img.push(
                formatStr(this.first, c.filename)
            );
        }else if(c instanceof EntrySnd){
            snd.push(
                formatStr(this.first, c.filename)
            );
        }
    }
    this.img = img;
    this.snd = snd;
};

Pixer.prototype.create = function(){
    this.pixi = [];
};

