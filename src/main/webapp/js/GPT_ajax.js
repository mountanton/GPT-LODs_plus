"use strict"

//Each response in the current session gets marked with an integer
var response_cnt = 0;

function getGPTanswer(){
    let question = $('#Qtext').val();
    const req_button = $('#getResponse');
    let msg =  $('#wait_msg');

    req_button.prop('disabled', true); //disable questions while waiting for GPT response
    msg.css('visibility', 'visible');
    closeWindow();

    let xhr = new XMLHttpRequest();
    xhr.onload = function (){
        $('#Qtext').val('');
        if(xhr.readyState === 4 && xhr.status === 200){
            //Create the question to be displayed
            let Qcontainer = $('<div>').addClass('usrQuestion');
            let Qtext = $('<div>').addClass('QnAtext').text(question);
            let Qheader = $('<h4>').text('Q'+ (response_cnt + 1) +': \u00a0');
            Qtext.prepend(Qheader);
            Qcontainer.append(Qtext);

            //Create the answer to be displayed
            let Rcontainer = $('<div>').addClass('GPTresponse');
            let Rtext = $('<div>').addClass('QnAtext');
            let Rpar  = $('<p>').text(xhr.responseText).css('padding-left', '10px');
            Rpar.attr("id", "resp" + response_cnt);
            let Rheader = $('<h4>').text('R'+ (response_cnt + 1) +': \u00a0');
            Rtext.prepend(Rheader);
            Rtext.append(Rpar);
            Rcontainer.append(Rtext);

            const static_cnt = response_cnt; //so value doesn't get updated each time counter is increased
            //Add on click event listener to response container for calling LODsyndesis API
            Rcontainer.click(function() {
                openWindow();

                let mark_bnt  = $('#mark_btn');
                let info_bnt  = $('#ent_info_btn');
                let facts_btn = $('#get_facts_btn');
                $('#q_id').html('Selected: R' +(static_cnt + 1))

                //remove previously applied functions
                mark_bnt.off('click');
                info_bnt.off('click');
                facts_btn.off('click');

                mark_bnt.click(function(){mark_entities(xhr.responseText, static_cnt)});
                info_bnt.click(function (){get_ent_info(xhr.responseText, static_cnt)});
                facts_btn.click(function (){get_facts(xhr.responseText, static_cnt)});
            });

            $('#chat_cont').append(Qcontainer);
            $('#chat_cont').append(Rcontainer);

            req_button.prop('disabled', false);
            msg.css('visibility', 'hidden');
            $('#click_info').css('display', 'block');
            response_cnt++;
        }
        else if (xhr.status !== 200) {
            alert("Something went wrong server responded with: \n" + xhr.responseText);
            req_button.prop('disabled', false);
            msg.css('visibility', 'hidden');
        }
    };

    let data = $('#InitialForm').serialize();
    let url = 'GPTanswer?' + data + '&question=' + encodeURIComponent(question);
    xhr.open('GET',url);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

//Used to bind user's chat choice (Continuous or Independent) to the session
function startChat(){

    let xhr = new XMLHttpRequest();
    xhr.onload = function (){
        if(xhr.readyState === 4 && xhr.status === 200){
            //Load Chatting window
            $('#opts_cont').load('chat.html');
        }
        else if (xhr.status !== 200) {
            alert("Something went wrong server responded with: \n" + xhr.responseText);
        }
    }

    let conv_type = $("input[name='conv_type']:checked").val();

    xhr.open('POST', 'InitiateSession?conv_type=' + conv_type);
    xhr.send();
}