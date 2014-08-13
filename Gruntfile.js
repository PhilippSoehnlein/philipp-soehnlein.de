module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //watch: {
        //    files: ['<%= jshint.files %>'],
        //    tasks: ['jshint', 'qunit']
        //},

        autoprefixer: {
            options: {
                opbrowsers: ['last 2 version']
            },
            single_file: {
                src: 'src/main.css',
                dest: 'build/main.css'
            },
        },

        concat: {
            dist: {
                src: ['bower_components/normalize.css/normalize.css', 'build/main.css'],
                dest: 'build/all.css',
            },
        },

        processhtml: {
            dist: {
                files: {
                    'build/index.html': ['src/index.html']
                }
            }
        },

        uncss: {
            dist: {
                files: {
                    'build/all.css': ['build/index.html']
                }
            }
        },

        cssmin: {
            options: {
                keepSpecialComments: 0,
            },
            minify: {
                src: ['build/all.css'],
                dest: 'build/all.css',
            }
        },

        inline: {
            options:{
                tag: '' // inline all the things!
            },
            dist: {
                src: ['build/index.html'],
                dest: ['build/']
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'build/index.html': 'build/index.html',
                }
            }
        },

        copy: {
            main: {
                files: [
                    { src: 'build/index.html', dest: 'dist/index.html' },
                    { src: 'src/bg.jpg',       dest: 'dist/bg.jpg' },
                    { src: 'src/robots.txt',   dest: 'dist/robots.txt' },
                    { src: 'src/humans.txt',   dest: 'dist/humans.txt' },
                ]
            }
        },

        clean: {
            beforeBuild: ['build', 'dist'],
            afterBuild:  ['build'],
        },

        rsync: {
            options: {
                args: ['--verbose'],
                exclude: [],
                recursive: true,
            },
            prod: {
                options: {
                    host: process.env.PS_RSYNC_USER_AND_HOST,
                    src:  'dist/',
                    dest: '/home/phil/websites/philipp-soehnlein.de/htdocs',
                    delete: true,
                },
            },
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-rsync")

    grunt.registerTask('build', [
        'clean:beforeBuild',
        'autoprefixer',
        'concat',
        'processhtml',
        'uncss',
        'cssmin',
        'inline',
        'htmlmin',
        'copy',
        'clean:afterBuild',
    ]);

    grunt.registerTask('deploy', ['build', 'rsync']);
}
