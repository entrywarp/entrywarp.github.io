var UniqueId = function(){
    this.l = [];
};

UniqueId.prototype._ = function(n){
    var a = "_";
    for(var i = 0; i < n; ++i){
        a += (~~(Math.random() * 36)).toString(36);
    }
    return a;
};

UniqueId.prototype.pick = function(n=16){
    var a = "";
    do{
        a = this._(n);
    }while(this.l.includes(a));
    this.l.push(a);
    return a;
};

var uu = new UniqueId();

var EntryData = function(d){
    // this.d = d;
    this.id = d.id;
};

var EntryPic = function(d){
    EntryData.call(this, d);
    this.dim = d.dimension;
    let f = d.filename;
    let t = d.imageType;
    this._filename = f;
    this._fileurl = d.fileurl;
    this.imgType = t;
    if("fileurl" in d){
        this.filename = "https://playentry.org" + d.fileurl;
    }else{
        this.filename = `https://playentry.org/uploads/${
        f.slice(0, 2)
        }/${f.slice(2, 4)}/image/${f}.png`;
    }
    this.name = d.name;
};

var EntrySnd = function(d){
    EntryData.call(this, d);
    let f = d.filename;
    let t = d.ext;
    this._filename = f;
    this._fileurl = d.fileurl;
    this.sndType = t;
    if("fileurl" in d){
        this.filename = "https://playentry.org" + d.fileurl;
    }else{
        this.filename = `https://playentry.org/uploads/${
        f.slice(0, 2)
        }/${f.slice(2, 4)}/${f}.${t}`;
    }
    this.name = d.name;
    this.dur = d.duration;
};

var EntryScene = function(d){
    EntryData.call(this, d);
    this.name = d.name;
};

var EntryObject = function(d){
    EntryData.call(this, d);
    this.name = d.name;
    this.ent = d.entity;
    this.script = d.script;
};

var EntryBlockList = function(d, p=null){
    this.id = uu.pick();
    this.d = d;
    this.p = p; // 부모 BlockList
};

var EntryBlock = function(d, p=null, s=null){
    EntryData.call(this, d);
    this.stm = d.statements == null? []: d.statements;
    this.ext = d.extensions == null? []: d.extensions;
    this.par = d.params == null? [] : d.params;
    this.typ = d.type;
    for(var i = 0; i < this.par.length; ++i){
        if(this.par[i] != null && typeof this.par[i] == "object"){
            var bl = new EntryBlock(this.par[i], this.id, s); // 재귀 구조
            s.bValues.push(bl);
            this.par[i] = bl.id;
        }
    }
    for(var i = 0; i < this.stm.length; ++i){ //if-else 내부 코드 등
        var tt = this.stm[i], d = [];
        var t = new EntryBlockList(d, this);
        s.values.push(t);
        for(var k = 0; k < tt.length; ++k){
            var e2 = tt[k];
            s.bValues.push( new EntryBlock(e2, t.id, s) ); // 블록은 bValues!
            d.push(e2.id);
        }
        this.stm[i] = t.id;
    }
    this.p = p;
    var s = null; // 초기화
};

var Compiler = function(){
    this.data = null;
    this.values = [];
    this.ids = {};
    this.bValues = []; // 검색 속도 높이기 위해 구분
    this.bIds = {};
};

Compiler.prototype.loadValuesFromProj = function(d){
    if(typeof d == "string"){
        d = JSON.parse(d);
    }
    this.data = d;
    this.variables = d.variables;
    this.scenes = d.scenes;
    this.objects = d.objects;
    this.functions = d.functions;
    this.messages = d.messages;
    this.fps = d.speed;
    this.tmsMil = Math.round(1000/d.speed);
    this.tables = d.tables;
    this.values = [];
    this.ids = {};
    this.bValues = []; // 검색 속도 높이기 위해 구분
    this.bIds = {};
};

Compiler.prototype.loadImages = function(){
    if(this.data == null){
        throw new Error("Failed to load image; no data is given.");
    }
    var objs = this.objects;
    for(var i = 0; i < objs.length; ++i){
        var pics = objs[i].sprite.pictures;
        for(var j = 0; j < pics.length; ++j){
            this.values.push( new EntryPic(pics[j]) );
        }
    }
};

Compiler.prototype.loadSounds = function(){
    if(this.data == null){
        throw new Error("Failed to load sound; no data is given.");
    }
    var objs = this.objects;
    for(var i = 0; i < objs.length; ++i){
        var snds = objs[i].sprite.sounds;
        for(var j = 0; j < snds.length; ++j){
            this.values.push( new EntrySnd(snds[j]) );
        }
    }
};

Compiler.prototype.loadMedia = function(){
    this.loadImages();
    this.loadSounds();
};

Compiler.prototype.loadScenes = function(){
    if(this.data == null){
        throw new Error("Failed to load scene; no data is given.");
    }
    var scns = this.scenes;
    for(var i = 0; i < scns.length; ++i){
        this.values.push( new EntryScene(scns[i]) );
    }
};

Compiler.prototype.loadObjects = function(){
    if(this.data == null){
        throw new Error("Failed to load scene; no data is given.");
    }
    var objs = this.objects;
    for(var i = 0; i < objs.length; ++i){
        this.values.push( new EntryObject(objs[i]) );
    }
};

Compiler.prototype.loadScripts = function(){
    var objs = this.objects;
    for(var i = 0; i < objs.length; ++i){
        var ccs = JSON.parse(objs[i].script);
        for(var j = 0; j < ccs.length; ++j){
            var e1 = ccs[j], a = [];
            var t = new EntryBlockList(a); // reference (a)
            this.values.push(t);
            for(var k = 0; k < e1.length; ++k){
                var e2 = e1[k];
                this.bValues.push( new EntryBlock(e2, t.id, this) ); // 블록은 bValues!
                a.push(e2.id);
            }
        }
    }
};

Compiler.prototype.loadToDict = function(del=true){
    for(var i = 0; i < this.values.length; ++i){
        var c = this.values[i];
        this.ids[c.id] = c;
    }
    for(var i = 0; i < this.bValues.length; ++i){
        var c = this.bValues[i];
        this.bIds[c.id] = c;
    }
    if(del){
        this.values = [];
        this.bValues = [];
    }
};

Compiler.prototype.loadAll = function(){
    this.loadMedia();
    this.loadScenes();
    this.loadObjects();
    this.loadScripts();
    this.loadToDict();
};