
var hour = 17; //hour you want to run
var min =  31; //minute you want to run
var url = 'https://www.youtube.com/v/o0u4M6vppCI&autoplay=1';

function createAlarm(createType){
    var now = new Date();
    var day = now.getDate();
    if((now.getHours() >= hour) && (now.getMinutes() >= min)){day += 1;}
    if(now.getDay() > 5){return undefined;}
    var timestamp = +new Date(now.getFullYear(), now.getMonth(), day, hour, min, 0, 0);
    //                        YYYY               MM              DD  HH MM SS MS

    // Create
    if(createType === 'create'){
        chrome.alarms.create('ShiaSuprise!',{ when: timestamp });
        console.log('quiet, quiet, waiting for Shia');

        chrome.alarms.getAll(function(alarms){
            for(i=0;i<alarms.length;i++){
                var d = new Date(alarms[i].scheduledTime);
                console.log("Next Scheduled " +alarms[i].name+ ": " +d);
            }
        });
    }
    if(createType === 'cleanup'){
        chrome.alarms.create('ShiaWetNap', { when: timestamp-86000000 });
    }
}
createAlarm('create');

// Listen
chrome.alarms.onAlarm.addListener(function(alarm){
    var now = new Date();
    var d = new Date(alarm.scheduledTime);

    //within a 2 minutes of expected run time
    //if ((now.getTime() >= d.getTime())&&(d.getTime() - now.getTime() >= -120000)){
    if((now.getTime() >= d.getTime()) && (Math.abs(now.getTime() - d.getTime()) <= 120000)){
        if(alarm.name === 'ShiaSuprise!'){
            chrome.tabs.query({
                url: url
            }, function(tabs){
                if(tabs.length === 0) {
                    chrome.tabs.create({ url:url, active: true });
                } else{
                    // Focus first match instead of open new tab
                    chrome.tabs.update(tabs[0].id, { active: true });
                }
            });
            console.log('ClapClapClapClapClapClapClapClapClapClapClapClap');
            createAlarm('cleanup');
            createAlarm('create');
        }
        
        if(alarm.name === 'ShiaWetNap'){
            chrome.tabs.query({
                url: url
            }, function(tabs){
                if(tabs.length === 0){return;}
                else{
                    for(i=0;i<tabs.length;i++){
                        chrome.tabs.remove(tabs[i].id);
                    }
                }
            });
            console.log('You survived Shia LaBeouf... for now');
        }
    }
    else{console.log('Caught in a bear trap!');}
});
