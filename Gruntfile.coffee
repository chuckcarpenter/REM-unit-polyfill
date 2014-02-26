'use strict'
module.exports = (grunt) ->
    # load all grunt tasks
    # this assumes matchdep, grunt-contrib-watch, grunt-contrib-coffee, 
    # grunt-coffeelint, grunt-contrib-clean, grunt-contrib-uglify is in the package.json file
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
                        '  | <%= pkg.authors %>;\n' +
                        '**/\n'
        

        # clear out any unneccessary files
        clean: ['js/<%= pkg.name %>.min.js']


        # lint our files, because it's a good thing
        jshint:
            options:
                jshintrc: '.jshintrc'
            basic:
                src: ['js/<%= pkg.name %>.js']


        # clean up, minify and prepare for production use
        uglify:
            options:
                banner: '<%= banner %>'
            minify:
                files:
                    'js/<%= pkg.name %>.min.js': 'js/<%= pkg.name %>.js'

        ## TODO: add some tests                    
    
 
    grunt.registerTask 'default', [
        'clean'
        'jshint'
        'uglify'
    ]
