if (typeof jQuery !== 'undefined') {
  (function($) {
   	'use strict';

  	$('html');

  	<% if (props.includeJqueryValidation) { %>
    // Numeric only control handler
    $.fn.forceNumericOnly = function () {
      return this.each(function () {
        $(this).keydown(function (e) {
          var key = e.charCode || e.keyCode || 0;
          // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
          return (key === 8 || key === 9 || key === 46 || (key >= 37 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
        });
      });
    };
    $('.numeric_field').forceNumericOnly();

    var validateConfig = {<% if (props.includeBootstrap) { %>
      highlight: function(element) {
	      $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
	    },
	    unhighlight: function(element) {
	      $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
	    },
	    errorElement: 'span',
	    errorClass: 'help-block',
	    errorPlacement: function(error, element) {
        if(element.parent('.input-group').length || element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
					error.insertAfter(element.parent());
        } else {
          error.insertAfter(element);
        }
	    },<% } %>
	    submitHandler: function() {
				alert('submitted!');
			},
			rules: {
        'required-input': {
          required: true
        },
        'email-input': {
          required: true,
          email: true
        },
        'length-input':{
        	required: true,
        	minlength: 2,
          maxlength: 6
        },
        'number-input':{
        	required: true,
        	number: true
        }	
    	}
    };
		
		$('form').validate(validateConfig);
		<% } %>

  })(jQuery);
}    