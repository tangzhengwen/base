/**
 * Gruntfile JS
 * app1
 * 2015-08-03
 */

var Path = require('path');
var banner = '/**\n * app1 - v0.0.1\n' +
        ' * author: Don\n' +
        ' * update: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * copyright: http://tangzhengwen.com/\n */\n';

var node_modules = '../../node_modules/';
var imagemin_pngout = require(node_modules + 'imagemin-pngout')();
var imagemin_jpegtran = require(node_modules + 'imagemin-jpegtran')();
var imagemin_gifsicle = require(node_modules + 'imagemin-gifsicle')();
var imagemin_svgo = require(node_modules + 'imagemin-svgo')();

module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            build: {
                options: {
                    banner: banner,
                    compress: {
                        drop_console: true
                    }
                },
                files: {
                    '../../dist/app1/js/all.js': ['js/a.js', 'js/b.js'],
                }
            }
        },
        cssmin: {
            build: {
                options: {
                    banner: banner
                },
                files: {
                    '../../dist/app1/css/all.css': ['css/a.css', 'css/b.css'],
                }
            }
        },
        copy: {
            html: {
                expand: true,
                cwd: '',
                src: '**/*.html',
                dest: '../../dist/app1/'
            },
            img: {
                expand: true,
                cwd: 'img/',
                src: '**',
                dest: '../../dist/app1/img/'
            }
        },
        imagemin: {
            build: {
                options: {
                    use: [imagemin_pngout, imagemin_jpegtran, imagemin_gifsicle, imagemin_svgo]
                },
                files: [{
                        expand: true,
                        cwd: '../../dist/app1/img/',
                        src: '**/*.{png,jpg,gif,svg}',
                        dest: '../../dist/app1/img/'
                    }]
            },
        },
        usemin: {
            build: {
                src: ['../../dist/app1/*.html'],
            },
        },
        htmlmin: {
            build: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                expand: true,
                cwd: '../../dist/app1/',
                src: ['*.html'],
                dest: '../../dist/app1/'
            }
        },
        replace: {
            build: {
                options: {
                    patterns: [{
                            match: 'timestamp',
                            replacement: '<%= grunt.template.today("yyyymmddHHMMss") %>'
                        }],
                },
                files: [
                    {expand: true, flatten: true, src: ['../../dist/app1/*.html'], dest: '../../dist/app1/'},
                    {expand: true, flatten: true, src: ['../../dist/app1/js/*.js'], dest: '../../dist/app1/js/'},
                    {expand: true, flatten: true, src: ['../../dist/app1/css/*.css'], dest: '../../dist/app1/css/'},
                ]
            }
        }
    });

    // 加载提供"uglify"任务的插件
    grunt.task.loadTasks(Path.join(node_modules, "grunt-contrib-uglify", 'tasks'));
    grunt.task.loadTasks(Path.join(node_modules, "grunt-contrib-cssmin", 'tasks'));
    grunt.task.loadTasks(Path.join(node_modules, "grunt-contrib-htmlmin", 'tasks'));
    grunt.task.loadTasks(Path.join(node_modules, "grunt-contrib-copy", 'tasks'));

    grunt.task.loadTasks(Path.join(node_modules, "grunt-contrib-imagemin", 'tasks'));
    grunt.task.loadTasks(Path.join(node_modules, "grunt-newer", 'tasks'));
    grunt.task.loadTasks(Path.join(node_modules, "grunt-replace", 'tasks'));
    grunt.task.loadTasks(Path.join(node_modules, "grunt-usemin", 'tasks'));

    grunt.registerTask('default', [
        'uglify', 'cssmin',
        'copy:html', 'copy:img',
        'newer:imagemin',
        'usemin',
        'htmlmin',
        'replace'
    ]);
};
