
var is_window_open = false;

function openWindow(){
    const slidingWindow = $('#sliding-window');
    slidingWindow.css('bottom', '2px');

    $('#sliding-window').addClass('animate');
    setTimeout(function() {
        $('#sliding-window').removeClass('animate');
    }, 300); // 300 milliseconds (0.3 seconds) matches the transition duration
}

function closeWindow(){
    const slidingWindow = $('#sliding-window');
    slidingWindow.css('bottom', '210px');
}