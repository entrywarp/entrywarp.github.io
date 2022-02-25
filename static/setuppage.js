if (!Object.fromEntries) {
	Object.fromEntries = function (entries){
		if (!entries || !entries[Symbol.iterator]) { throw new Error('Object.fromEntries() requires a single iterable argument'); }
		let obj = {};
		for (let [key, value] of entries) {
			obj[key] = value;
		}
		return obj;
	};
}

const playBig = "/static/play_big.svg";

const urlSearchParams = new URLSearchParams(window.location.search);
const urlParams = Object.fromEntries(urlSearchParams.entries());

var genImageDiv = function(url){
    var div = document.createElement("div");
    div.style.backgroundImage = `url(${url})`;
    div.style.backgroundRepeat = "no-repeat";
    div.style.backgroundPosition = "50% center";
    return div;
};

var Loader = function(){
    this.div = document.createElement("div");
};

Loader.prototype.load = async function(appendBody=true){
    var lid = urlParams.id || "6211e2d42df43a002c65d607";
    var playButton = genImageDiv(playBig);
    playButton.style.width = "111px";
    playButton.style.height = "111px";
    
    var data = await getAPI({
        "apiType": "searchProject",
        "id": lid
    });
    var comp = new Compiler(data);
    comp.loadValuesFromProj(data);
    comp.loadAll();
    console.log(comp);
    
    const body = this.div;
    if(appendBody){
        document.body.appendChild(body);
    }
};

var setupPage = new Loader();




