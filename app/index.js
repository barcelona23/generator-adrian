'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    //yeoman.generators.Base.apply(this, arguments);
    //initializing to constructor

    // setup the test-framework property, Gruntfile template will need this
    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });
    this.testFramework = this.options['test-framework'];

    this.option('coffee', {
      desc: 'Use CoffeeScript',
      type: Boolean,
      defaults: false
    });
    this.coffee = this.options.coffee;

    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay());
    this.log(chalk.cyan('Welcome to ' + chalk.red('Fully customizable Web App') + 
      ' generator! by '+chalk.white.bgMagenta.bold('Adrian Rodriguez!')
    ));
    this.log(chalk.cyan(
      'You will find HTML5 Boilerplate, Normalize, Smacss, jQuery, and a Gruntfile.js to build your next app.'
    ));

    var prompts = [{
      type: 'input',
      name: 'appName',
      message: 'What is App Name Project?',
      default: 'barcelona-App'
    },{
      type    : 'checkbox',
      name    : 'stylesfeatures',
      message : 'What CSS options would like to use?',
      choices : [{
        name    : 'Bootstrap',
        value   : 'includeBootstrap',
        checked : false
      },{
        name    : 'Foundation',
        value   : 'includeFundation',
        checked : false
      },{
        name    : 'Semantic UI',
        value   : 'includeSemantic',
        checked : false  
      },{
        name    : 'Sass',
        value   : 'includeSass',
        checked : false
      }]
    },{
      type    : 'checkbox',
      name    : 'scriptsfeatures',
      message : 'Do u need some javacript components?',
      choices : [{
        name    : 'jQuery Validation',
        value   : 'includeJqueryValidation',
        checked : false
      }]
    },{
      type    : 'checkbox',
      name    : 'extrasFeatures',
      message : 'Would u like to add some extras?',
      choices : [{
        name    : 'Modernizr',
        value   : 'includeModernizr',
        checked : false
      },{
        name    : 'Font Awesome',
        value   : 'includeFontAwesome',
        checked : false
      }]
    }];

    this.prompt(prompts, function (props) {
      this.appName        = props.appName;
      var stylesfeatures  = props.stylesfeatures;
      var scriptsfeatures = props.scriptsfeatures;
      var extrasFeatures  = props.extrasFeatures;

      function hasFeature(feat) {
        return (stylesfeatures && stylesfeatures.indexOf(feat) !== -1) ||
        (scriptsfeatures && scriptsfeatures.indexOf(feat) !== -1) ||
        (extrasFeatures && extrasFeatures.indexOf(feat) !== -1) ;
      }

      this.includeBootstrap        = hasFeature('includeBootstrap');
      this.includeSass             = hasFeature('includeSass');
      this.includeFundation        = hasFeature('includeFundation');
      this.includeSemantic         = hasFeature('includeSemantic');
      this.includeJqueryValidation = hasFeature('includeJqueryValidation');
      this.includeModernizr        = hasFeature('includeModernizr');
      this.includeFontAwesome      = hasFeature('includeFontAwesome');     

      done();
    }.bind(this));
  },

  createFolders: function(){
    this.directory('app');
    this.mkdir('app/styles');
    this.mkdir('app/scripts');
    this.mkdir('app/images');
  },

  writing: {
    app : function () {
      this.fs.copyTpl(
        this.templatePath('_index.html'),
        this.destinationPath('app/index.html'),
        { props: this }
      );
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        { props: this }
      );
    },

    bower : function(){
      var bower = {
        name         : this._.slugify(this.appName),
        private      : true,
        version      : '1.0.0',
        dependencies : {},
        overrides    : {}
      };

      //css
      var bs = '';
      if (this.includeBootstrap) {
        bs = 'bootstrap' + (this.includeSass ? '-sass-official' : '');
        bower.dependencies[bs] = '~3.3.4';
      } 
      if (this.includeFundation) { bower.dependencies.foundation = '~5.5.1'; }
      if (this.includeSemantic) { bower.dependencies['semantic-ui'] = '~1.11.6'; }

      if(!this.includeBootstrap && !this.includeFundation && !this.includeSemantic) {
        bower.dependencies['normalize-css'] = '~3.0.3';
      }

      //javascripts
      if (this.includeJqueryValidation) { bower.dependencies['jquery-validation'] = '~1.13.1'; }

      //extras
      if (this.includeModernizr) { bower.dependencies.modernizr = '~2.8.2'; }
      if (this.includeFontAwesome) { bower.dependencies['font-awesome'] = '~4.3.0'; }

      //overrides
      if (this.includeBootstrap && this.includeSass) {
        bower.overrides[bs] = {
          'main': [
            'assets/stylesheets/_bootstrap.scss',
            'assets/fonts/bootstrap/glyphicons-halflings-regular.eot',
            'assets/fonts/bootstrap/glyphicons-halflings-regular.svg',
            'assets/fonts/bootstrap/glyphicons-halflings-regular.ttf',
            'assets/fonts/bootstrap/glyphicons-halflings-regular.woff',
            'assets/javascripts/bootstrap/affix.js',
            'assets/javascripts/bootstrap/alert.js',
            'assets/javascripts/bootstrap/button.js',
            'assets/javascripts/bootstrap/carousel.js',
            'assets/javascripts/bootstrap/collapse.js',
            'assets/javascripts/bootstrap/dropdown.js',
            'assets/javascripts/bootstrap/tab.js',
            'assets/javascripts/bootstrap/transition.js',
            'assets/javascripts/bootstrap/scrollspy.js',
            'assets/javascripts/bootstrap/modal.js',
            'assets/javascripts/bootstrap/tooltip.js',
            'assets/javascripts/bootstrap/popover.js'
          ],
        };
      }    

      if (this.includeFontAwesome && this.includeSass) {
        bower.overrides['font-awesome'] = {
          'main': [
            './css/font-awesome.css',
            './scss/font-awesome.scss',
            './fonts/*'
          ],
        };
      }  

      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
      this.write('bower.json', JSON.stringify(bower, null, 2));
    },

    mainStylesheet : function () {
      var css = 'main.' + (this.includeSass ? 's' : '') + 'css';
      this.fs.copyTpl(
        this.templatePath('_styles/_' + css),
        this.destinationPath('app/styles/' + css),
        { props: this }
      );
    },

    mainScripts : function () {
      this.fs.copyTpl(
        this.templatePath('_scripts/_main.js'),
        this.destinationPath('app/scripts/main.js'),
        { props: this }
      );
      this.fs.copyTpl(
        this.templatePath('_scripts/_plugins.js'),
        this.destinationPath('app/scripts/plugins.js'),
        { props: this }
      );
    },

    git : function () {
      this.fs.copy(
        this.templatePath('gitattributes'),
        this.destinationPath('.gitattributes')
      );
      this.fs.copyTpl(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore'),
        { props: this }
      );
    },

    ftp : function () {
      this.fs.copy(
        this.templatePath('ftpauth'),
        this.destinationPath('.ftpauth')
      );
    },

    projectfiles : function () {

      this.template('Gruntfile.js');

      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('htaccess'),
        this.destinationPath('.htaccess')
      );
    }
  },

  install : function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }

});
