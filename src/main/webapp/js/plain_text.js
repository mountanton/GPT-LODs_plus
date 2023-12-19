
//Each question in the current session gets marked with an integer
var question_cnt = 0;

function load_content(opts){
    if(opts == 'GPT')
        $('#main').load('GPT.html');
    else
        $('#main').load('Text.html');
}

function enable_services(){
    let question = $('#Qtext').val();
    if(question.trim() ==''){
        alert('Please Enter some text first!');
        return;
    }

    display_question(question);

    $('#Qtext').val('');
    const static_cnt = question_cnt;
    $('#my_box').load('text_operations.html', function() {
        enable_operations(question, static_cnt); //for the current question (when continue is clicked)
    });

    question_cnt++;
}

function display_question(question){
    let Qcontainer = $('<div>').addClass('text_question');
    let Qtext = $('<div>').addClass('QnAtext');
    let Qpar  = $('<p>').text(question).css('padding-left', '10px');
    Qpar.attr("id", "resp" + question_cnt);     //it is named resp, so it works with the rest of the functions that are already implemented
    let Qheader = $('<h4>').text('T' + (question_cnt +1) + ': \u00a0');

    if(!(question_cnt % 2))
        Qcontainer.css('background-color', 'white');

    Qtext.prepend(Qheader);
    Qtext.append(Qpar);
    Qcontainer.append(Qtext);


    const static_cnt = question_cnt;
    Qcontainer.click(function(){
        enable_operations(question, static_cnt);    //when user clicks on a previous question's container
        animate_container(Qcontainer);

    });

    $('#chat_cont').append(Qcontainer);
}

//border animation on click of a specific question
function animate_container(Qcontainer){

    Qcontainer.addClass('animate_container');
    setTimeout(function() {
        Qcontainer.removeClass('animate_container');
    }, 300); // 300 milliseconds (0.3 seconds) matches the transition duration
}

function enable_operations(txt, static_cnt){
    console.log(txt + '  ' +static_cnt);


    let mark_bnt  = $('#mark_btn');
    let info_bnt  = $('#ent_info_btn');
    let facts_btn = $('#get_facts_btn');

    //remove previously applied functions
    mark_bnt.off('click');
    info_bnt.off('click');
    facts_btn.off('click');

    mark_bnt.click(function(){mark_entities(txt, static_cnt)});
    info_bnt.click(function (){get_ent_info(txt, static_cnt)});
    facts_btn.click(function (){get_facts(txt, static_cnt)});
}
