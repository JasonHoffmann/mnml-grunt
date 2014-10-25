// Grunt implementation of MNML

// Loading in BrowserSync module here to avoid conflicts with watch task
var browserSync = require("browser-sync");

// Initiate Grunt 
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Minify CSS Files in the CSS Directory
    cssmin: {
      target: {
        files: [{
          expand: true,
          src: ['css/mnml.css'],
          dest: '',
          ext: '.min.css'
        }]
      }
    },

    // Optimize Images in the img directory
    imagemin: {
      target: {
        files: [{
          expand: true,
          cwd: './img/',
          src: ['**/*.{png,jpg,jpeg,gif,svg}'],
          dest: './img'
        }]
      }
    },

    // Use csslint without box-sizing or compatible vendor prefixes (these
    // don't seem to be kept up to date on what to yell about)
    csslint: {
      options: {
        'compatible-vendor-prefixes': false,
        'box-sizing': false,
        'important': false,
        'known-properties': false
      },
      src: ['css/mnml.css']
    },

    // Make sure to run Autoprefixer on CSS file
    autoprefixer: {
      target: {
        src: 'css/mnml.css'
      }
    },

    // Compile SASS, getting rid of sourcemap
    sass: {
      target: {
        options: {
          'sourcemap' : 'none'
        },
        files: {
          'css/mnml.css': 'sass/mnml.scss'
        }
        
      }
    },

    // Watching for changes to HTML or SASS files
    // Also image files for image optimization
    watch: {
      options: {
        spawn: false
      },
      styles: {
        files: 'sass/*.scss',
        tasks: ['preprocess', 'bs-reload']
      },
      images: {
        files: 'img/*.{png,jpg,jpeg,gif,svg}',
        tasks: ['imagemin']
      },
      html: {
        files: './*.html',
        tasks: ['bs-reload']
      }
    }
  });
    

grunt.loadNpmTasks('grunt-browser-sync');
grunt.loadNpmTasks('grunt-autoprefixer');
grunt.loadNpmTasks('grunt-contrib-csslint');
grunt.loadNpmTasks('grunt-contrib-imagemin');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-watch');


// Setting up browsersyn to run in parallel to watch task
grunt.registerTask("bs-init", function () {
  var done = this.async();
  browserSync({
    server: "./"
  }, function (err, bs) {
      done();
  });
});

// Reloads the browser with browsersync
grunt.registerTask('bs-reload', function() {
  browserSync.reload();
});

// Run grunt preprocess to compile our css or default to open server
grunt.registerTask('preprocess', ['sass', 'autoprefixer', 'cssmin']);
grunt.registerTask('default', ['imagemin', 'preprocess', 'bs-init', 'watch']);

};