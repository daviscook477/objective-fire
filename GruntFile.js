module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), // the package file to use
    conf: grunt.file.readJSON('config.json'),
    qunit: {
      src: ['<%=conf.testFolder%>/src.html'],
      build: ['<%=conf.testFolder%>/build.html'],
      build_min: ['<%=conf.testFolder%>/build-min.html']
    },
    watch: {
      files: ['<%=conf.testFolder%>/*.js', '<%=conf.testFolder%>/*.html', '<%=conf.devFolder%>/**/*.js'],
      tasks: ['qunit']
    },
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: '<%=conf.devFolder%>/',
          outdir: '<%=conf.docFolder%>/'
        }
      }
    },
    copy: {
      dist: {
        files:[{expand: true, cwd:'<%=conf.devFolder%>/', src:'**', dest:'<%=conf.tempFolder%>/'}]
      }
    },
    ngAnnotate: {
      src: {
        files: [{expand: true, src:['<%=conf.tempFolder%>/**/*.js']}]
      }
    },
    uglify: {
      mangle: {
        files: {
          '<%=conf.distFolder%>/objective-fire.min.js': ['<%=conf.tempFolder%>/objective-fire.js', '<%=conf.tempFolder%>/**/*.js'],
        }
      },
      no_mangle: {
        files: {
          '<%=conf.distFolder%>/objective-fire.js': ['<%=conf.tempFolder%>/objective-fire.js', '<%=conf.tempFolder%>/**/*.js'],
        },
        options: {
          mangle: false
        }
      }
    },
    clean: {
      temp: ['<%=conf.tempFolder%>/']
    },
    jshint: {
      src: ['<%=conf.devFolder%>/**/*.js']
    }
  });
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('test', ['qunit:src', 'watch']);
  grunt.registerTask('doc', ['yuidoc']);
  grunt.registerTask('hint', ['jshint']);
  grunt.registerTask('check', ['hint', 'qunit']);
  grunt.registerTask('compile', ['copy', 'ngAnnotate', 'uglify', 'clean']);
  grunt.registerTask('build', ['qunit:src', 'doc', 'compile', 'qunit:build', 'qunit:build_min']);
  grunt.registerTask('default', ['build']);
};
