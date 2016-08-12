var Config = function() {
	this.src    = "public/src";
	this.build  = "public/build";
	this.deploy = "public/deploy";
	this.gulp = {
		"clean"  :   [this.bulid,this.deploy],   
		"style"  : {
			"src"   : this.src    + "/sass/",
			"build" : this.build  + "/style/",
			"deploy" : this.deploy + "/style/",
		},
		"scripts" : {
			"src"   : this.src    + "/scripts/",
			"build" : this.build  + "/scripts/",
			"deploy" : this.deploy + "/scripts/"
		},
		"images" : {
			"src"   : this.src    + "/imgs/**/*.{jpg,png,gif,jpeg}",
			"build" : this.build  + "/imgs/",
			"deploy" : this.deploy + "/imgs/"
		}
	}
}
var config = new Config();
module.exports = config;
