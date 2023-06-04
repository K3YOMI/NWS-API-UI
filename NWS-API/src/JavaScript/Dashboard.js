let whitelisted_events1 = ['Flash Flood Watch', 'Severe Thunderstorm Watch', 'Tornado Watch','Special Marine Warning','Flash Flood Warning','Severe Thunderstorm Warning','Tornado Warning',]
let global_header1 = {'User-Agent': 'AtmosphericX','Accept': 'application/geo+json','Accept-Language': 'en-US'}
let count_settings1 = {
    latest_string : '',
    latest_int : 0,
    total_warnings: 0,
    total_watches: 0,
    event_counts : { 
        'Tornado Emergencies': 0,
        'PDS Warnings': 0,
        'Tornado Confirmed Warnings': 0,
        'Tornado Radar Indicated Warnings': 0,
        'Desctructive Severe Thunderstorm Warnings': 0,
        'Considerable Desctructive Severe Thunderstorm Warnings': 0,
        'Severe Thunderstorm Warnings': 0,
        'Flash Flood Warnings': 0,
        'Special Marine Warnings': 0,
        'Severe Thunderstorm Watches': 0,
        'Tornado Watches': 0,
        'Flash Flood Watches': 0,
    }
}
function decyph_event1(event_table) {  let eventType = event_table.properties.event; let eventDesc = event_table.properties.description.toLowerCase(); let tornadoThreat = event_table.properties.parameters.tornadoDetection; let thunderstorm = event_table.properties.parameters.thunderstormDamageThreat; if (eventDesc.includes(`particularly dangerous situation`)) { return `PDS Warning`; } else if (eventDesc.includes(`tornado emergency`) && eventType == `Tornado Warning`) { return `Tornado Emergency`; } else if (eventDesc == `Tornado Warning`) {  if (tornadoThreat == `RADAR INDICATED`) { return `Radar Indiciated Tornado Warning`; } else if (eventDesc == `OBSERVED`) { return `Confirmed Tornado Warning`; } else { return `Expired Tornado Warning`; } } else if (eventType == `Severe Thunderstorm Warning`) { if (thunderstorm == `DESTRUCTIVE`) { return `Destructive Severe Thunderstorm Warning`; } else if (thunderstorm == `CONSIDERABLE`) { return `Considerable Severe Thunderstorm Warning`; } else { return `Severe Thunderstorm Warning`; } }else{ return eventType; }}
function format_state1(locations) {  for (let i = 0; i < locations.length; i++) {if (locations[i] == ',') {state = locations.substring(i + 2, i + 4);return state;}}return 'NotInStates';}
function is_new_alert1(alert_temp) { if (alert_temp == count_settings1.latest_string) { return false; }else{return true;}}
function is_valid_alert1(alert_temp) {for (let i = 0; i < whitelisted_events1.length; i++) { if (alert_temp == whitelisted_events1[i]) { return true;}}return false;}
function format_locations1(locations) { following_areas = locations.split(','); if (following_areas.length > 1) { return `${following_areas}`;}return following_areas[0];}
function whithin_time_frame1(time_end) { let time_epoch = new Date(time_end).getTime();let current_time = new Date().getTime();if (time_epoch > current_time) { return true;}return false;}
function reset_active_alerts1() {  console.log("Resetting active alerts"); count_settings1.total_warnings = 0; count_settings1.total_watches = 0; let countsettings = Object.keys(count_settings1.event_counts); for (let i = 0; i < countsettings.length; i++) { count_settings1.event_counts[countsettings[i]] = 0; } }
function request_active_alerts1() {
    fetch(`https://api.weather.gov/alerts/active`, {headers: global_header1}).then(response => response.text()).then(data => {
        reset_active_alerts1()
        let jsonData = JSON.parse(data);
        let alerts = jsonData.features;
        let updated = new Date(jsonData.updated);
        let better_time = new Date(updated).toLocaleString('default', { month: 'long' }) + ' ' + updated.getDate() + ', ' + updated.getFullYear() + ' ' + updated.getHours() + ':' + updated.getMinutes() + ':' + updated.getSeconds() + " - " + updated.toLocaleString('en-US', { timeZoneName: 'short' }).split(' ')[2];
        if (updated.getMinutes() < 10) { better_time = new Date(updated).toLocaleString('default', { month: 'long' }) + ' ' + updated.getDate() + ', ' + updated.getFullYear() + ' ' + updated.getHours() + ':0' + updated.getMinutes() + ':' + updated.getSeconds() + " - " + updated.toLocaleString('en-US', { timeZoneName: 'short' }).split(' ')[2];}
        document.getElementById("last_updated").innerHTML = `API Last Updated: ${better_time}`;
        for (let i = 0; i < alerts.length; i++) {
            let eventValid = is_valid_alert1(alerts[i].properties.event)
            let eventExpire = whithin_time_frame1(alerts[i].properties.expires)
            let eventLocations = alerts[i].properties.areaDesc
            let messageType = alerts[i].properties.messageType
            let eventType = alerts[i].properties.event
            let eventDesc = alerts[i].properties.description
            let tornadoThreat = alerts[i].properties.parameters.tornadoDetection
            let thunderstorm = alerts[i].properties.parameters.thunderstormDamageThreat
            if (eventValid == false || eventExpire == false) { continue; }
            if (eventType.includes(`Watch`)) { count_settings1.total_watches += 1;} 
            if (eventType.includes(`Warning`)) { count_settings1.total_warnings += 1;} 
            let lowerDesc = eventDesc.toLowerCase()
            what_is_it = decyph_event1(alerts[i])
            if (what_is_it == `Tornado Emergency`) { count_settings1.event_counts['Tornado Emergencies'] += 1;}
            if (what_is_it == `PDS Warning`) { count_settings1.event_counts['PDS Warnings'] += 1;}
            if (what_is_it == `Confirmed Tornado Warning`) { count_settings1.event_counts['Tornado Confirmed Warnings'] += 1;}
            if (what_is_it == `Radar Indiciated Tornado Warning`) { count_settings1.event_counts['Tornado Radar Indicated Warnings'] += 1;}
            if (what_is_it == `Destructive Severe Thunderstorm Warning`) { count_settings1.event_counts['Desctructive Severe Thunderstorm Warnings'] += 1;}
            if (what_is_it == `Considerable Severe Thunderstorm Warning`) { count_settings1.event_counts['Considerable Desctructive Severe Thunderstorm Warnings'] += 1;}
            if (what_is_it == `Severe Thunderstorm Warning`) { count_settings1.event_counts['Severe Thunderstorm Warnings'] += 1;}
            if (what_is_it == `Flash Flood Warning`) { count_settings1.event_counts['Flash Flood Warnings'] += 1;}
            if (what_is_it == `Special Marine Warning`) { count_settings1.event_counts['Special Marine Warnings'] += 1;}
            if (what_is_it == `Severe Thunderstorm Watch`) { count_settings1.event_counts['Severe Thunderstorm Watches'] += 1;}
            if (what_is_it == `Tornado Watch`) { count_settings1.event_counts['Tornado Watches'] += 1;}
            if (what_is_it == `Flash Flood Watch`) { count_settings1.event_counts['Flash Flood Watches'] += 1;}
        }
        document.getElementById("total_warnings").innerHTML = `${count_settings1.total_warnings} Active Warnings `;
        document.getElementById("total_watches").innerHTML = `${count_settings1.total_watches} Active Watches`;
        document.getElementById("total_tore_emergencies").innerHTML = `${count_settings1.event_counts["Tornado Emergencies"]} Warnings`;
        document.getElementById("total_pds_warnings").innerHTML = `${count_settings1.event_counts["PDS Warnings"]} Warnings`;
        document.getElementById("total_tore_confirmed_warnings").innerHTML = `${count_settings1.event_counts["Tornado Confirmed Warnings"]} Warnings`;
        document.getElementById("total_tore_radar_warnings").innerHTML = `${count_settings1.event_counts["Tornado Radar Indicated Warnings"]} Warnings`;
        document.getElementById("total_desctructive_severe_warnings").innerHTML = `${count_settings1.event_counts["Desctructive Severe Thunderstorm Warnings"]} Warnings`;
        document.getElementById("total_considerable_severe_warnings").innerHTML = `${count_settings1.event_counts["Considerable Desctructive Severe Thunderstorm Warnings"]} Warnings`;
        document.getElementById("total_severe_warnings").innerHTML = `${count_settings1.event_counts["Severe Thunderstorm Warnings"]} Warnings`;
        document.getElementById("total_flash_flood_warnings").innerHTML = `${count_settings1.event_counts["Flash Flood Warnings"]} Warnings`;
        document.getElementById("total_marine_warnings").innerHTML = `${count_settings1.event_counts["Special Marine Warnings"]} Warnings`;
        document.getElementById("total_severe_watches").innerHTML = `${count_settings1.event_counts["Severe Thunderstorm Watches"]} Watches`;
        document.getElementById("total_tornado_watches").innerHTML = `${count_settings1.event_counts["Tornado Watches"]} Watches`;
        document.getElementById("total_flash_flood_watches").innerHTML = `${count_settings1.event_counts["Flash Flood Watches"]} Watches`;
    }).catch(error => {
        console.log(`I am too lazy to fix errors that do happen right now. Please report them if you see them on the Github Repository \n\n${error}`);
    });
}
request_active_alerts1()
setInterval(request_active_alerts1, 1000);