var $ = function( id ) { 
	var ret;
	var spl = id.split(">");
	switch(spl[0].charAt(0)){
		case '#':
			ret= document.getElementById( spl[0].substr(1) );
			break;
		case '.':
			ret= document.getElementsByClassName(spl[0].substr(1) );
			break;
		case '$': 
			ret= document.getElementsByTagName( spl[0].substr(1) );
			break;
		default:
			ret= document.getElementById( spl[0] );
			break;
	}
	if(spl.length<=1) return ret;
	else return ret.getAttribute(spl[1]);
};

function b64toBlobURL(b64Data, contentType, sliceSize) {
	var parts = b64Data.match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/]+)/);
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(parts[3]);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {type: contentType});
    return URL.createObjectURL(blob);
}

var revokeBlobURL = function(URL){
	window.URL.revokeObjectURL(URL);
}

var charCode = function(string){
	return string.charCodeAt(0);
}

function sign(x) {
    return (x > 0) - (x < 0);
}

function constrain(num, a, b){
	return num = Math.min(Math.max(num, a), b);
}

function degToRad(d) {
    // Converts degrees to radians
    return d * 0.0174532925199432957;
}

function itoa(i)
{ 
   return String.fromCharCode(i);
}

function extractNumber(value)
{
    var n = parseInt(value);
	
    return n == null || isNaN(n) ? 0 : n;
}

function distance(p1,p2){
	return Math.sqrt(Math.pow((p2.x-p1.x),2)+Math.pow((p2.y-p1.y),2));
}

Array.prototype.min = function(){
	return Math.min.apply({},this);
}

Array.prototype.max = function(){
	return Math.max.apply({},this);
}

Array.prototype.last = function(){
	return this[this.length-1];
}

function getPos(el) {
    // yay readability
    for (var lx=0, ly=0; el != null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
}

function aveCont(points){
	if(points===undefined) points=5;
	var samps = [];
	this.ave=0;
	var ind=0;
	var tot=0;
	for(var i=0; i<points; i++){
		samps.push(0.0);
	}
	
	this.changeNumSamps = function(num){
		samps.length=0;
		for(var i=0; i<num; i++){
			samps.push(0.0);
		}
	}
	
	this.addSample=function(val){
		tot-=samps[ind];
		samps[ind]=val;
		tot+=val;
		this.ave=tot/samps.length;
		ind=(ind+1)%samps.length;
		return this.ave;
	}
	
	return this;
}

function map(val,inMin,inMax,outMin,outMax){
	return (val-inMin)*(outMax-outMin)/(inMax-inMin)+outMin;
}