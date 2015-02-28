module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), // the package file to use
    conf: grunt.file.readJSON('config.json'),
    qunit: {
      all: ['<%=conf.testFolder%>/*.html']
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
      objFire: {
        files: [{expand: true, src:['<%=conf.tempFolder%>/**/*.js']}]
      }
    },
    uglify: {
      objFire: {
        files: {
          '<%=conf.distFolder%>/objective-fire.min.js': ['<%=conf.tempFolder%>/**/*.js']
        }
      }
    },
    clean: {
      temp: ['<%=conf.tempFolder%>/']
    }
  });
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('test', ['qunit', 'watch']);
  grunt.registerTask('doc', ['yuidoc']);
  grunt.registerTask('compile', ['copy', 'ngAnnotate', 'uglify', 'clean']);
  grunt.registerTask('build', ['test', 'doc', 'compile']);
  grunt.registerTask('default', ['build']);
};
