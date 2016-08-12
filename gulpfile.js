var path = require('path');
var fs   = require('fs');

var gulpath = require('./config/config.gulp.js');

var gulp     = require('gulp');
var sass     = require('gulp-sass');
var css      = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');

var clean  = require('gulp-clean');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require("gulp-rename");

var cache  = require('gulp-cache');
var notify = require('gulp-notify');

var merge = require('merge-stream');

//清理编译后的目录
gulp.task("clean",function(){
	//return gulp.src(gulpath.gulp.clean)
		return gulp.src('public/build')
		.pipe(clean())										//执行清理
		.pipe(notify({message:'build,deploy目录清理完毕'}));			//清理完毕通知
});

//编译sass
gulp.task('style',function(){
	var folders = getFolders(gulpath.gulp.style.src);			//获取目录
	console.log(folders);
	var tasks = folders.map(function(folder){				//对每个目录进行操作
		return gulp.src(path.join(gulpath.gulp.style.src,folder,'/*scss'))
		.pipe(sass({style:'expanded'}))						//编译sass为css
		.pipe(concat(folder+'.css'))						//合并css
		.pipe(gulp.dest(gulpath.gulp.style.build))				//输出css到build目录
		.pipe(notify({message:'编译sass到build目录完毕'}))	//输出css到bulid成功提示
		//.pipe(css())										//压缩css
		//.pipe(rename({suffix:'.min'}))						//重命名
		//.pipe(gulp.dest(gulpath.gulp.style.deploy))				//输出css到deploy目录
		//.pipe(notify({message:'css压缩到deploy完毕'}));		//输出css到deploy成功提示
	});
	return merge(tasks);
});

//javascirpt
gulp.task('scripts',function(){
	var folders = getFolders(gulpath.gulp.scripts.src);			//获取目录
	console.log(folders);
	var tasks = folders.map(function(folder){
		return gulp.src(path.join(gulpath.gulp.scripts.src,folder,'/*js'))
		.pipe(jshint())														//javascript语法检查
		.pipe(concat(folder+'.js'))											//js文件合并
		.pipe(gulp.dest(gulpath.gulp.scripts.build))								//输出js到build目录
		.pipe(notify({message:'javascript检查合并到bulid目录完毕'}))		//输出js到build成功提示
		//.pipe(uglify())														//js压缩
		//.pipe(rename({suffix:'.min'}))										//重命名
		//.pipe(gulp.dest(gulpath.gulp.scripts.deploy))								//输出js到deploy目录
		//.pipe(notify({message:'javascript压缩命名到deploy完毕'}));			//输出js到deploy成功提示
	});
	return merge(tasks);
});
//压缩图片
gulp.task('images',function(){
	return gulp.src(gulpath.gulp.images.src)
		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))		//压缩缓存
		.pipe(gulp.dest(gulpath.gulp.images.build))														//输出图片到build目录
		.pipe(notify({message:'图片压缩到build目录完毕'}))											//图片输出到bulid成功提示
		// .pipe(gulp.dest(gulpath.gulp.images.deploy))														//输出图片到deploy目录
		// .pipe(notify({message:'图片压缩到deploy目录完毕'}));											//输出图片到deploy成功提示
});

//watch任务
gulp.task('watch',function(){
	gulp.watch(gulpath.gulp.style.src+'/**/*.scss', ['style']);
	gulp.watch(gulpath.gulp.scripts.src+'/**/*.js', ['scripts']);
	gulp.watch(gulpath.gulp.images.src+'/**/*.*', ['images']);
});

gulp.task('default',['clean'],function(){
	gulp.start('style','scripts','images','watch');
});


function getFolders(dir){
	return fs.readdirSync(dir).filter(function(file){
		return fs.statSync(path.join(dir,file)).isDirectory();
	});
}