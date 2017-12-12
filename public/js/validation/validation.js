$(document).ready(function() {
    $('#signIn_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                        stringLength: {
                        min: 2,
                    },
                        notEmpty: {
                        message: 'Please enter your first name'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Please enter your email address'
                    },
                    emailAddress: {
                        message: 'Please enter a valid email address'
                    }
                }
            },
            password: {
                validators: {
                     stringLength: {
                        min: 4,
                        max:12,
                        message:'Password must be between 4 and 8 characters long'
                    },
                    notEmpty: {
                        message: 'Please enter your password'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message:'Password must contain character and number'
                    },
                }
            }
            }, submitHandler: function(validator, form, submitButton) {
              // console.log('submittt');
            }
           
        });
        

        // $("#signIn_form").submit(function(ev){
            
        //     console.log('52');    
        //     ev.preventDefault();
        
        // });
        $("#signIn_form_submit").on("click", function(){
           console.log('57');
           var bootstrapValidator = $("#signIn_form").data('bootstrapValidator');
           bootstrapValidator.validate();
           console.log(bootstrapValidator.isValid());
           if(bootstrapValidator.isValid()){
             console.log('hererer');
             $('#signIn_form_submit').prop("disabled", false);
             $('#signIn_form_submit').removeProp('disabled');
             $("#signIn_form").submit();

            //  $.ajax({
            //     type: "POST",
            //     url: "signIn",
            //     data: $('#signIn_form').serialize(),
            //     success: function(msg){
            //       // do something
            //       console.log('do something');
            //     },
            //     error: function(){
            //       console.log("error");
            //     }
            //   });
            //return true;
            }
           else{return false;}
        
        });
});

