module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), // the package file to use
    qunit: {
      all: ['tests/*.html']
    },
    watch: {
      files: ['tests/*.js', 'tests/*.html', 'src/*.js'],
      tasks: ['qunit']
    },
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: 'src/',
          outdir: 'docs/'
        }
      }
    },
    ngAnnotate: {
      objFire: {
        files: {
          'temp/*.js': ['src/*.js']
        }
      }
    },
    uglify: {
      objFire: {
        files: {
          'build/*.min.js': ['temp/*.js']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('test', ['qunit', 'watch']);
  grunt.registerTask('doc', ['yuidoc']);
  grunt.registerTask('compile', ['ngAnnotate', 'uglify']);
  grunt.registerTask('build', ['test', 'doc', 'compile']);
  grunt.registerTask('default', ['build']);
};
