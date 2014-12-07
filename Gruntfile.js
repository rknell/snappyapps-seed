module.exports = function(grunt) {

  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-istanbul');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-mocha-istanbul')

  grunt.initConfig({
    // Configure a mochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ['engine/**/*.test.js', 'api/**/*.test.js', 'engine/*.test.js', 'api/*.test.js']
      }
    },
    mocha_istanbul: {
      coverage: {
        src: ['engine', 'api'], // a folder works nicely
        options: {
          mask: '**/*.test.js'
        }
      }
    },
    istanbul_check_coverage: {
      default: {
        options: {
          coverageFolder: 'coverage*', // will check both coverage folders and merge the coverage results
          check: {
            lines: 80,
            statements: 80
          }
        }
      }
    }
  });

  grunt.event.on('coverage', function(lcovFileContents, done){
    // Check below
    done();
  });

  grunt.registerTask('test', 'mochaTest');
  grunt.registerTask('default', 'coverage');
  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);

};
