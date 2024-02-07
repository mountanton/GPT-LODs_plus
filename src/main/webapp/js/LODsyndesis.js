"use strict"

const already_marked = new Array(100).fill(false);
const already_displayed = new Array(100).fill(false);
var   last_displayed = 0;
var   jsonMap = {};
var   pop_counter = 0;

function create_pop_windows(respID){
    const div_cont = $('#resp' + respID);
    let text_cont = div_cont.text();

    //for every entity that is found
    jsonMap[respID].forEach(item => {
        if (item.isEntity) {
            let convertedURI = item.dbpediaURI.substring(item.dbpediaURI.indexOf('dbpedia.org')); //cut http
            convertedURI = convertedURI.replace(/\//g, '$');                             //replace '/' with '$'

            let rega = new RegExp('\\b' + item.textpart + '\\b', 'i');

            const static_cnt = pop_counter; //so value doesn't get updated each time counter is increased

            text_cont = text_cont.replace(rega, '<div style="display: inline-block" class="popup" ' +
                'onmouseover="toggle_pop_on('+static_cnt+')" onmouseout="toggle_pop_off('+static_cnt+')">' + item.textpart +

                    '<span class="popuptext" id="popWindow'+ pop_counter++ +'">' +
                        '<b>' + item.textpart +'</b> <br>' +
                        '<img src="' + item.img +'" width="100" height="100" title="' + item.textpart + '"> <br>' +
                        '<p style="margin-top: 0;">(' + item.type + ')</p>'+
                        '<a href="https://demos.isl.ics.forth.gr/lodsyndesis/RunQuery?URI=' + convertedURI +
                        '&queryType=DatDom" target="_blank">All Datasets</a> <br>' +
                        '<a href="https://demos.isl.ics.forth.gr/lodsyndesis/RunQuery?URI=' + convertedURI +
                        '&queryType=EquivalentURIs" target="_blank">URIs</a> <br>' +
                        '<a href="https://demos.isl.ics.forth.gr/lodsyndesis/RunQuery?URI=' + convertedURI +
                        '&queryType=triples" target="_blank">All Facts (triples)</a> ' +
                    '</span>' +
                '</div>');
        }
    });

    div_cont.html(text_cont);

}

function toggle_pop_on(id_num){
    var popup = document.getElementById("popWindow"+id_num);
    popup.classList.add("show");
}

function toggle_pop_off(id_num){
    var popup = document.getElementById("popWindow"+id_num);
    popup.classList.remove("show");
}

function mark_entities(text, respID){
    if (jsonMap[respID] !== undefined)    //if already called LOD for this specific response
        do_marking(respID);
    else {
        //call lodSyndesis
        getLODentities(text)
            .then(json => {
                console.log(json);
                jsonMap[respID] = json;
                create_pop_windows(respID);
                do_marking(respID);
            })
            .catch(error => {
                console.error(error);
            });
    }
}

//Mark or Unmark entities
function do_marking(respID){
    const div_cont = $('#resp' + respID);
    let text_cont = div_cont.html();

    if (!already_marked[respID]) {
        //for every entity that is found
        jsonMap[respID].forEach(item => {
            if (item.isEntity) {
                let rega = new RegExp('\\b' + item.textpart + '\\b', 'i');

                text_cont = text_cont.replace(rega, '<mark>' + item.textpart + '</mark>');
            }
        });

        div_cont.html(text_cont);
        already_marked[respID] = true;
    }
    else {
        div_cont.find("mark").contents().unwrap();
        already_marked[respID] = false;
    }
}

function get_ent_info(text, respID){

    if (jsonMap[respID] !== undefined)    //if already called LOD for this specific response
        create_table(respID);
    else {
        //call lodSyndesis
        getLODentities(text)
            .then(json => {
                console.log(json);
                jsonMap[respID] = json;
                create_table(respID);
                create_pop_windows(respID);
            })
            .catch(error => {
                console.error(error);
            });
    }
    $('#fail_msg').css('display', 'none');

}

//fills the entities' information table
/**Im using links for calling the Rest-Api of LODsyndesis because its way faster (and easier) than making http requests*/
/** links differ on the query parameters and certain query values*/
/**didn't make a function for that because it was more straight forward this way*/
 function create_table(respID){

    if (!already_displayed[respID]) {
        $('#ent_table tr:not(:first-child)').remove(); //delete any previous rows
        let table = $('#ent_table');

        //for every entity that is found
        jsonMap[respID].forEach(item => {
            if (item.isEntity) {
            /**Entity column*/
                let Row = $('<tr><td align="center"> <img src="'  + item.img + '" width="75" height="75" title="' + item.textpart + '">' + //img
                    '<br> <a href="'  + item.dbpediaURI + '" target="_blank">' + item.textpart + '</a>  ' + //name-link
                    '<p style="margin-top: 0;">(' + item.type + ')</p></td>'                                                          //type
                );

            /**Provenance column*/
                let convertedURI = item.dbpediaURI.substring(item.dbpediaURI.indexOf('dbpedia.org')); //cut http
                convertedURI = convertedURI.replace(/\//g, '$');                             //replace '/' with '$'

                Row.append('<td align="center"> [ <a href="https://demos.isl.ics.forth.gr/lodsyndesis/rest-api/objectCoreference?uri='
                    + item.dbpediaURI + '&provenance=true">RDF</a>, ' + //export as RDF link

                    '<a href="https://demos.isl.ics.forth.gr/lodsyndesis/RunQuery?URI=' + convertedURI
                    +'&queryType=DatDom" target="_blank">HTML</a>  ]'   //html link for all datasets
                );

            /** Eq URIs column*/
                Row.append('<td align="center"> [ <a href="https://demos.isl.ics.forth.gr/lodsyndesis/rest-api/objectCoreference?uri='
                    + item.dbpediaURI + '">RDF</a>, ' + //export as RDF link

                    '<a href="https://demos.isl.ics.forth.gr/lodsyndesis/RunQuery?URI=' + convertedURI
                    +'&queryType=EquivalentURIs" target="_blank">HTML</a> ]'   //html link for all datasets
                );

            /** Triples column*/
                Row.append('<td align="center"> [ <a href="https://demos.isl.ics.forth.gr/lodsyndesis/rest-api/allFacts?uri='
                    + item.dbpediaURI + '">RDF</a>, ' + //export as RDF link

                    '<a href="https://demos.isl.ics.forth.gr/lodsyndesis/RunQuery?URI=' + convertedURI
                    +'&queryType=triples" target="_blank">HTML</a> ]'   //html link for all datasets
                );

            /**K-Datasets column*/
                Row.append('<td align="center"> [ <a href="https://demos.isl.ics.forth.gr/lodsyndesis/rest-api/entityBasedDatasetDiscovery?entities='
                    + item.dbpediaURI + '&subsetSize=3&topK=10&measurementType=coverage">CSV</a>, ' + //export as CSV link

                    '<a href="https://demos.isl.ics.forth.gr/lodsyndesis/RunQueryCov?URI=' + item.dbpediaURI
                    +'&mt=coverage&qt=3&lt=10" target="_blank">HTML</a> ]</td></tr>'   //html link for Dataset Discovery
                );

                table.append(Row);
            }
        });

        $('#entities_cont').css('display', 'block');
        already_displayed[last_displayed] = false;   //na markarei me closed to teleutaio pou eixe anoiksei
        already_displayed[respID] = true;            //markarei me open auto pou anoikse twra
        last_displayed = respID;                    //to krataei ws teleutaio

        //kleise to fact table (an upirxe kapoio anoixto)
        $('#facts_cont').css('display', 'none');
        $('#validation_cont').css('display', 'none');
        already_displayed_facts[last_displayed_fact] = false;
    }
    else {
        $('#entities_cont').css('display', 'none');
        already_displayed[respID] = false;
    }
}

//makes the initial request to LOD API
function getLODentities(text) {
    return new Promise((resolve, reject) => {
      //  let loader = $('#loading');
       // loader.css('display', 'inline');

        const mark_button = $('#mark_btn');
        const info_button = $('#ent_info_btn');
        mark_button.prop('disabled', true); // Disable button while waiting for LOD response
        info_button.prop('disabled', true);

        let URL = 'https://demos.isl.ics.forth.gr/LODsyndesisIE/rest-api/exportAsJSON';

        let ERtools = get_ERtools();
        if(ERtools == 'Error') {
            reject('No ERtools selected');
            mark_button.prop('disabled', false);
            info_button.prop('disabled', false);
           // loader.css('display', 'none');
            return;
        }
        let equivalentURIs = false;  //we don't need other URI's

        text = text.replaceAll(" ", "%20");
        text = text.replaceAll("?", "%3F");

        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);
                resolve(jsonResponse);
                $('#get_fatcs_er_btn').prop('disabled',false);  //annotation complete, enable enhanced getFacts
            } else if (xhr.status !== 200) {
                const error = "Something went wrong LODsyndesis responded with: \n" + xhr.responseText;
                reject(error);
            }
           // loader.css('display', 'none');
            mark_button.prop('disabled', false);
            info_button.prop('disabled', false);
        };


        const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Proxy to work with tomcat, should remove later! (should request access before making requests)
        const targetUrl = URL + '?text=' + text + '&ERtools=' + ERtools + '&equivalentURIs=' + equivalentURIs;

        xhr.open('GET', proxyUrl + targetUrl);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    });
}

function get_ERtools(){
    let ERtools = $('input[name="ERtools"]:checked').map(function() {
        return $(this).val();
    }).get();

    if(ERtools.length == 0) {
        alert('Please Select at least one Entity Recognition tool!');
        return 'Error';
    }
    else if(ERtools.length == 3)
        return 'ALL';
    else if(ERtools.length == 1)
        return ERtools[0];
    else{
        if(ERtools[0] == 'WAT'){
            if(ERtools[1] == 'DBS')
                return 'DBS_WAT';
            else
                return 'SCNLP_WAT';
        }
        else
            return 'DBS_SCNLP';
    }
}