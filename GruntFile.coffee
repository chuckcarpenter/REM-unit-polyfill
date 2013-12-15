'use strict'
module.exports = (grunt) ->
    # load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks

    grunt.initConfig
        # load in the module information
        pkg: grunt.file.readJSON 'package.json'
        # path to Grunt file for exclusion
        gruntfile: 'Gruntfile.coffee'
        # generalize the module information for banner output
        banner: '/**\n' +
                        ' * Module: <%= pkg.name %> - v<%= pkg.version %>\n' +
                        ' * Description: <%= pkg.description %>\n' +
                        ' * Date Built: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        ' * Copyright (c) <%= grunt.template.today("yyyy") %>' +
                        '  | <%= pkg.author.name %>;\n' +
                        '**/\n'
        
        # basic watch tasks first for development
        watch:
            js:
                files: [
                    '*.js'
                ]
                tasks: 'uglify'
                options:
                    livereload: true


        # clear out any unneccessary files
        clean: ['dist/<%= pkg.name %>.min.js', '!.node_modules/']


        # lint our files because it's the right thing to do
        jshint:
            options:
                curly: true
                eqeqeq: true
                eqnull: true
                expr: true
                latedef: true
                onevar: true
                noarg: true
                node: true
                trailing: true
                unused: true
                # evil: true
                # regexdash: true
                # browser: true
                # wsh: true
                # trailing: true
                # sub: true
                force: true

            all: ['src/<%= pkg.name %>.js', '!<%= pkg.name %>.min.js']


        # clean up, minify and prepare for production use
        uglify:
            options:
                banner: '<%= banner %>'
            build:
                files:
                    'dist/<%= pkg.name %>.min.js': 'src/<%= pkg.name %>.js'

        ## TODO: we need to add tests to start in all modules
        # prefered to start with Jasmine                    
    
 
    grunt.registerTask 'default', [
        'clean'
        'jshint'
        'uglify'
    ]