#创建项目
	mkdir luck10 && cd luck10
	express -e
	cd . && npm install
	SET BEBUG=luck10:* & npm start

#初始化git仓库
	git init
	touch .gitignore

#集成bower
	npm install bower --save
	bower init
	touch .bowerrc
	bower instal zepto

#集成gulp
	npm install gulp 
				gulp-concat 
				gulp-clean-css
				gulp-rename 
				gulp-uglify
				gulp-jshint 
            	gulp-imagemin
            	gulp-sass
            	gulp-notify
            	gulp-clean
            	gulp-cache 
            	merge-stream
            	readable-stream
			--save-dev
	gulpfile.js

#创建配置目录
	config
	   config.gulp.json


		
	