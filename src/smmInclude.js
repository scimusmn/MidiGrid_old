var debug = false;

var includeManager = new function(){
  var self =this;
  this.root =document.location.origin+document.location.pathname;
  this.includes = [];

  //record new scripts as they are added
  this.register = function (srcs,loadFxn,src) {
    this.shorten(src);
    var dep = [];
    if(typeof this.includes[src] == 'object'){
       dep = this.includes[src].dependents;
    }
    this.includes[src]={src:src,srcs:srcs,loadFxn:loadFxn,done:false,dependents:dep};
  }

  this.addDependent = function (src,which) {
    this.shorten(src);
    this.shorten(which);
    var dep =[]
    var done = false;
    if(this.includes.indexOf(src)>=0){
       dep = this.includes[src].dependents;
       done = this.includes[src].done;
    }
    else this.includes[src] = {src:src,done:false,dependents:dep}
    if(dep.indexOf(src)==-1) dep.push(which);
    this.includes[src].dependents = dep;
  }

  this.shorten = function (src) {
    if(~src.indexOf(self.root)) src = src.substring(self.root.length);
    return src;
  }

  this.checkIncludes = function (src) {
    src = this.shorten(src);
    var incl = self.includes[src];
    if(debug) console.log("Checking includes for "+src);
    if(typeof incl == 'object'){
      var loaded = true;
      for (var i = 0; i < incl.srcs.length; i++) {
        var next =self.includes[incl.srcs[i]];
        if(typeof next == 'object'){
          var noDone = (typeof next.done == 'undefined');
          if(debug) console.log(next.src+" is "+((next.done||(!next.loading&&noDone))?"done":"not done"));
          if(!(next.done||(!next.loading&&noDone))){
            loaded = false;
            if(next.dependents.indexOf(src)==-1) next.dependents.push(src);
          }
        }
      }
      if(loaded&&!incl.done){
        if(debug) console.log("Note: "+incl.src+" and includes are done");
        incl.done=true;
        if(typeof incl.loadFxn == 'function') incl.loadFxn();
        for (var i = 0; i < incl.dependents.length; i++) {
          if(debug) console.log("recheck "+incl.dependents[i]);
          self.checkIncludes(incl.dependents[i]);
        }
      }
    }
  }
}

function include(srcLocations,onLoaded){
  var curScript = includeManager.shorten(document.currentScript.src);
  if(debug) console.log("These are the includes for "+curScript);
  var numLoaded = 0;
  includeManager.register(srcLocations,onLoaded,curScript);
  var loaded = function () {
    if(this.src){
      var src = includeManager.shorten(this.src);
      if(src) includeManager.includes[src].loading=false;
    }
    if(++numLoaded>=srcLocations.length){
      includeManager.checkIncludes(curScript);
    }
  }
  var scripts = [].slice.call(document.querySelectorAll("script"));
  var found =false;
  for (var i = 0; i < srcLocations.length; i++) {
    if(debug) console.log("-->"+srcLocations[i]);
    scripts.forEach(function (item,index,array) {
      if(item.getAttribute("src")==srcLocations[i]) found=true;
    });
    if(!found){
      var scrpt = document.createElement("script");
      var src= includeManager.shorten(srcLocations[i]);
      scrpt.src = src;
      scrpt.addEventListener('load', loaded, false);
      includeManager.includes[src] = {src:src,loading:true,dependents:[]};
      document.head.insertBefore(scrpt,document.currentScript);//
    }

    //in case another module loaded the script just before and
    //it hasn't loaded fully
    else if(includeManager.includes[srcLocations[i]]){
      includeManager.includes[srcLocations[i]].dependents.push(curScript);
    }
    else loaded();
  }
  if(!srcLocations.length) loaded();
}

var includer = new function (){

  this.script = document.currentScript;
  this.app = this.script.getAttribute("main");

  include(["src/smm_utils.js",this.app]);
};
