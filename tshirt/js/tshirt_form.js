$(document).ready(function() {

    //Browser detection and redirection
        //DETECT DEVICE

        var deviceName;

        function detectDevice()
        {
        	if
        	(
        	(navigator.userAgent.match(/iPhone/i))
        	||
        	(navigator.userAgent.match(/iPod/i))
        	||
        	(navigator.userAgent.match(/iPad/i))
        	)
        	{
        		deviceName = "iosdevice";
        	}
        	else if (navigator.userAgent.match(/Android/i))
        	{
        		deviceName = "android";
        	}
        	else if (navigator.userAgent.match(/BlackBerry/i))
        	{
        		deviceName = "blackberry";
        	}
        	else if (navigator.userAgent.match(/IEMobile/i))
        	{
        		deviceName = "iemobile";
        	}
        	else if (navigator.userAgent.match(/Silk/i))
        	{
        		deviceName = "kindle";
        	}
        	else
        	{
        		deviceName = "computer";
        	}

        	//alert(deviceName);
        }

        detectDevice();
        if(deviceName == 'android') {
            window.location.assign("https://play.google.com/store/apps/details?id=com.festember.festemberapp");
        }
        else {
                var privVariables = (function(){

                    var user_auth_url = "http://api.pragyan.org/tshirt/userauth";
                    var tshirt_url = "http://api.pragyan.org/tshirt/register";
                    var qr_url = "http://api.pragyan.org/tshirt/qrcode";
                    var user_gender, user_size;
                    var priv_user_roll, priv_user_password;
                    
                    //Submit button
                    $("button#submit_user_auth").click(function() {
                        
			
                        priv_user_roll = $("#user_roll").val();
                        priv_user_password = $("#user_password").val();
                        if(priv_user_roll.length==0 || priv_user_password.length==0){
			   alert("Please fill all details");
			   return;
			}
                        $("button#submit_user_auth").prop('disabled',true);
                        $("#loginspinner").addClass("is-active");
                        if(priv_user_roll.length == 9) {
                            var form_data  = '{"user_roll":"' + String(priv_user_roll) + '","user_password":"' + String(priv_user_password) + '"}';
                            var json_form_data = JSON.parse(form_data);
                            //console.log(form_data);
                            $.ajax({
                                type: "POST",
                                url: user_auth_url,
                                async: true,
                                processData: true,
                               // contentType: 'application/json;charset=UTF-8',
                                data: {
                                    'user_roll': String(priv_user_roll),
                                    'user_pass': String(priv_user_password)
                                },
				timeout: 5000,
                                success: function(data) {
                                    //Logic for if the status code, etc,etc then the next step
                                        
                                    //console.log(data);
                                    $("button#submit_user_auth").prop('disabled',false);
                                    $("#loginspinner").removeClass("is-active");

                                    if(data['status'] == '0'){
                                        //console.log("Received error is: " + data['error']);
                                        alert("Username / Password is Incorrect");
                                    }
                                    else if(data['status'] == '1') {
                                        //console.log("Success");
                                        askAmount();
                                    }
                                    else if(data['status'] == '2') {
                                    
                                     $("div.user_auth").fadeOut("slow", function() {
                                        $("div.user_auth").css("z-index", "-3");
                                        $("div.show_qr").css("z-index", "11");
                                        $("div.show_qr").fadeIn("slow");

                                    });

                                        getQR();
                                        //console.log("Received error is: " + data['error']);
                                    }
                                    else if(data['status'] == '3') {
                                        //console.log("Received error is : " + data['error']);
                                       alert("There is some error. Sorry for the inconvenience caused.");
                                    }
                                },
                                error: function(jqxhr, status, message) {
                                    console.log("Error : " + status, message, jqxhr);
                                    $("#loginspinner").removeClass("is-active");
				    alert("The server seems to be overloaded. Check your internet connection and try again in a short while, or try using the app.");
                                    $("button#submit_user_auth").prop('disabled',false);
                                }
                            });
                        }
                        else {
                            //Doesn't work
                            // $("span.user_auth").css("visibility","visible");
                            alert("Roll no must be 9 digits");
                            return;
                        }
                        return false;//prevent the url issue
                    });

                    //After user auth asks amount to pay
                    function askAmount() {
                        $("div.user_auth").fadeOut("slow", function() {
                            $("div.user_auth").css("z-index", "-1");
                            $("div.fees_data").css("z-index", "8");
                            $("div.fees_data").fadeIn("slow");
                        });
                        $("button#back_submit_amount").click(function() {
                            $("div.fees_data").fadeOut("slow", function() {
                                $("div.fees_data").css("z-index", "-6");
                                $("div.user_auth").css("z-index", "9");
                                $("div.user_auth").fadeIn("slow");
                            });
                        });
                        $("#submit_amount").click(function() {
                            if($("#option_food").is(":checked")){
                                var food_cost = 550;
                                finalFood(food_cost);
                            }
                            else if ($("#option_food_tshirt").is(":checked")) {
                                var food_tshirt_cost = 700;
                                askTshirt(food_tshirt_cost);
                            }
                        });
                    }

                    function askTshirt(food_tshirt_cost) {
                        $("div.fees_data").fadeOut("slow", function() {
                            $("div.fees_data").css("z-index", "-3");
                            $("div.tshirt_data").css("z-index", "11");
                            $("div.tshirt_data").fadeIn("slow");

                        });
                        $("button#back_tshirt_next").click(function() {
                            $("div.tshirt_data").fadeOut("slow", function() {
                                $("div.tshirt_data").css("z-index", "-2");
                                $("div.fees_data").css("z-index", "8");
                                $("div.fees_data").fadeIn("slow");
                            });
                        });
                        $("button#tshirt_next").click(function() {
                            //Gender Check
                            //console.log("NEXT CLICKED");
                            if($("#option_male").is(":checked")){
                                user_gender = "male";
                            }
                            else if($("#option_female").is(":checked")){
                                user_gender = "female";
                            }
                            //Size check
                            if($("#option_small").is(":checked")){
                                user_size = 'S';
                                finalTshirt(food_tshirt_cost);
                            }
                            else if($("#option_medium").is(":checked")){
                                user_size = 'M';
                                finalTshirt(food_tshirt_cost);
                            }
                            else if($("#option_large").is(":checked")){
                                user_size = 'L';
                                finalTshirt(food_tshirt_cost);
                            }
                            else if($("#option_xlarge").is(":checked")){
                                user_size = 'XL';
                                finalTshirt(food_tshirt_cost);
                            }
                            else if($("#option_xxlarge").is(":checked")){
                                user_size = 'XXL';
                                finalTshirt(food_tshirt_cost);
                            }
                        });
                    }

                    function finalTshirt(food_tshirt_cost) {
                        //console.log("Inside final tshirt funciton");
                        $("div.tshirt_data").fadeOut("slow", function() {
                            $("div.tshirt_data").css("z-index", "-4");
                            $("div.final_tshirt").css("z-index", "10").fadeIn("slow");
                            //console.log(user_size);
                            $("span#provided_tshirt_roll").text(priv_user_roll);
                            $("span#provided_cost").text(food_tshirt_cost);
                            $("span#provided_size").text(user_size);
                            $("span#provided_gender").text(user_gender);

                            var flag = 0;
                            $("button#back_submit_tshirt_confirm").click(function() {
                                $("div.final_tshirt").fadeOut("slow", function() {
                                    $("div.final_tshirt").css("z-index", "-4");
                                    $("div.tshirt_data").fadeIn("slow").css("z-index", "8");
                                    flag = 1;
                                });
                            });

                            if(flag == 1) {
                                return;
                            }

                            $("button#submit_tshirt_confirm").click(function() {
                                var form_data = '{"user_roll":"'+ priv_user_roll +'", "user_pass":"'+ user_password +'","user_gender":"'+ user_gender +'", "user_tshirt_size":"'+ user_size +'","user_amount":"'+ food_tshirt_cost +'"}';
                                var json_form_data = JSON.parse(form_data);
                                $.ajax({
                                    type: "POST",
                                    url: tshirt_url,
                                    async: true,
                                    processData: true,
                                    //contentType: 'applicaiton/json;charset=UTF-8',
                                    data: {
                                        'user_roll': priv_user_roll,
                                        'user_pass': priv_user_password,
                                        'user_gender': user_gender,
                                        'user_tshirt_size': user_size,
                                        'user_amount': food_tshirt_cost
                                    },
                                    success: function(data) {
                                        ////console.log(data);
                                        //console.log("The ajax request was successful");
                                        if (data['status'] == '2') {
                                            //console.log("Successful (but...)");
                                            //console.log(data['error']);
                                            getQR();
                                        }
                                        else if(data['status'] == '0') {
                                            //console.log("Received error is : " + data['error']);
                                            alert("Username / Password is Incorrect");
                                        }
                                        else if (data['status'] == '3') {
                                            //console.log(data['error']);
                                            alert("Some error has occurred. Sorry for the inconvenience caused");
                                        }
                                        //Call QR code window
                                    },
                                    error: function(jqxhr, status, message) {
                                        console.log("Error : " + status);
                                    }
                                })
                            });
                        });
                    }

                    function finalFood(food_cost) {
                        $("div.fees_data").fadeOut("slow", function() {
                            $("div.fees_data").css("z-index", "-2");
                            $("div.final_food").css("z-index", "8").fadeIn("slow");
                            //console.log(priv_user_roll);
                            $("span#provided_roll").text(priv_user_roll);
                            $("span#provided_cost").text(food_cost);

                            $("button#back_submit_food_confirm").click(function() {
                                $("div.final_food").fadeOut("slow", function() {
                                    $("div.final_food").css("z-index", "-6");
                                    $("div.fees_data").css("z-index", "9").fadeIn("slow");
                                });
                            });

                            $("button#submit_confirm").click(function() {

                                var form_data = '{"user_roll":"'+ priv_user_roll +'", "user_pass":"'+ user_password +'","user_gender":"'+ null +'", "user_tshirt_size":"'+ null +'","user_amount":"'+ food_cost +'"}';
                                var json_form_data = JSON.parse(form_data);
                                //console.log({
                                //        'user_name': priv_user_roll,
                                //        'user_pass': priv_user_password,
                                //        'user_gender': null,
                                //        'user_tshirt_size': null,
                                //        'user_amount': food_cost
                                //    });
                                $.ajax({
                                    type: "POST",
                                    url: tshirt_url,
                                    async: true,
                                    //processData: false,
                                    //contentType: 'application/json;charset=UTF-8',
                                    data: {
                                        'user_roll': priv_user_roll,
                                        'user_pass': priv_user_password,
                                        'user_gender': null,
                                        'user_tshirt_size': null,
                                        'user_amount': food_cost
                                    },
                                    success: function(data) {
                                        ////console.log(data);
                                        //console.log("The ajax request was successful");
                                        if (data['status'] == '2') {
                                            //console.log("Successful (but...)");
                                            //console.log(data['error']);
                                            getQR();
                                            //getThank();
                                        }
                                        else if(data['status'] == '0') {
                                            //console.log(data['error']);
                                            alert("Username / Password is Incorrect");
                                        }
                                     
                                        else if (data['status'] == '3') {
                                            //console.log(data['error']);
                                            alert("Some error has occurred. Sorry for the inconvenience caused.");
                                        }
                                    },
                                    error: function(jqxhr, status, message) {
                                        console.log("Error : " + status);
                                    }
                                });
                            });
                        });
                    }

                    function getQR() {
                        $("div.final_tshirt").fadeOut("slow", function() {
                            $("div.final_tshirt").css("z-index", "-3");
                            $("div.final_food").css("z-index", "-6");
                            $("div.show_qr").css("z-index", "8").fadeIn("slow");
                        });
                        /*
                        $.ajax({
                            type: "POST",
                            url: qr_url,
                            async: true,
                            processData: true,
                            headers : {
                                "accept":"image/png"
                            },
                            //contentType: 'application/json;charset=UTF-8',
                            //contentType: 'application/json;charset=UTF-8',
                            data: {
                                'user_roll': String(priv_user_roll),
                                'user_pass': String(priv_user_password)
                            },
                            success: function(data) {
                                //console.log(data);
                                //var string64 = btoa(data);
                                    if(data['auth'] == '0'){
                                        //console.log("Received error is: " + data['error']);
                                        alert("Username / Password is Incorrect");
                                    }
                                    else if(data['auth'] = '3') {
                                        //console.log("Success");
                                        alert("Some error");
                                    }
				    else{
                                var string64 = window.btoa(unescape(encodeURI(data.replace(/\s/g, '')))); 
				var status=0;
                                try {
                                   window.atob(string64); 
                                } catch(e) {     
                                 status = 1; alert("Some error has occurred.");
                                }
				if(status==0){
			          $('.show_qr > div.field').html('<img src="data:image/png;base64,' + string64 + '" />');
				}
                            },
                            error: function(jqxhr, status, message) {
                                console.log("Error : " + status);
                            }
                        });
                        */
                        function showImg(e){
                             var img=document.createElement('img');
                              img.onload=function(e){
                                    var x = $('.show_qr > div.field')[0];
                                    x.innerHTML = "";
                                    x.appendChild(img);
                                    $('.show_qr > div.field').css("text-align","center");
                                    $('.show_qr > div.field > img').css("margin","auto");
                                    $('.show_qr > div.field > img').css("height","250px");
                                    $('.show_qr > div.field > img').css("width","250px");
                                    //document.body.appendChild(img);
                                      window.URL.revokeObjectURL(img.src);//Clear
                                       };
                               img.src=window.URL.createObjectURL(this.response);
                        }

                        var xmlhttp = new XMLHttpRequest;
                        xmlhttp.open("POST",qr_url,true);
                        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                        xmlhttp.responseType='blob';//Blob
                        xmlhttp.onload=showImg;
                        xmlhttp.send("user_roll="+priv_user_roll+"&user_pass="+priv_user_password);

                    }

                    function getThank() {
                        $("div.final_food").fadeOut("slow", function() {
                            $("div.final_food").css("z-index", "-3");
                            $("div.thank").css("z-index", "8").fadeIn("slow");
                        });
                    }
                })();
        }
});
