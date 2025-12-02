// Web Custom REndering Pop-up
    console.log("1");
clevertap.notificationCallback = function(msg){
      //raise the notification viewed and clicked events in the callback
  console.log("2");
      clevertap.raiseNotificationViewed();
  console.log("3");
      console.log(JSON.stringify(msg));            //your custom rendering implementation here
//       var $button = jQuery("<button></button>");   //element on whose click you want to raise the notification clicked event
//       $button.click(function(){
//          clevertap.raiseNotificationClicked();
//       });
};

function jumboChange(bannerKeys) {
    var textColour = ""
    var backgroundC = ""
    try {
        if(bannerKeys.color && bannerKeys.background){

            textColour=bannerKeys.color;
            backgroundC=bannerKeys.background;
            var header = document.getElementById( "jumboTron" );
            header.classList.remove("w3-red");
            header.style.color = textColour;
            header.style.backgroundColor = backgroundC;
        }
    } catch (error) {
        console.log(error)
    }
    
}

function iconChange(bannerKeys) {

    var iconImg =""
    try {
        if(bannerKeys.icon){iconImg=bannerKeys.icon
            var icondiv = document.getElementById("icons").classList;
            icondiv.remove("fa-coffee");
            icondiv.add(iconImg);
        }
        if (bannerKeys.imgURL) {
            var imagediv = document.getElementById("loginIcon");
            imagediv.removeChild(imagediv.firstElementChild);   
            const img = document.createElement("img");
            img.setAttribute("src",bannerKeys.imgURL);
            img.setAttribute("width","300px");
            img.setAttribute("style","object-fit: fill;");
            imagediv.appendChild(img);
            
        }
    } catch (error) {
        console.log(error)
    }
}

function titleChange(bannerKeys) {
    var titleText = "";
    try {
        if(bannerKeys.title){
            titleText=bannerKeys.title;
            document.getElementById("maintitle").innerHTML = titleText;

        }
    } catch (error) {
        console.log(error)
    }

}


document.addEventListener('CT_web_native_display', function(e) {
      console.log('Event is ', e.detail)
      const data = event.detail;
      clevertap.renderNotificationViewed(data);
      var bannerKeys = e.detail.kv
      var bannerType = bannerKeys.topic.split(",");
      console.log(bannerType)
      bannerType.forEach(topic => {
        switch (topic) {
            case "jumboTron":
                jumboChange(bannerKeys);
                break;
    
            case "icon":
                iconChange(bannerKeys);
                break;
    
            case "title":
                titleChange(bannerKeys);
                break;
            
            default:
                break;
          }
      });
    });

// For OnUserLogin Function Button Click
var pushcount = 1;
var itemcount1 = 1;
var itemcount2 = 1;



function start(){
    var label = document.getElementById("ctid");
    label.innerHTML = "Clevertap id is : " + clevertap.getCleverTapID();

    // window.clevertap.account.push({"id": "49K-57W-4Z6Z"});
    // console.log("49K-57W-4Z6Zgbafk");

}

function loginClicked(){
    var name = document.getElementById("profileName").value;
    var identity = document.getElementById("profileIdentity").value;
    var phone = document.getElementById("profilePhone").value;
    var email = document.getElementById("profileEmail").value;

    if(name != "" && identity != "" && phone != "" && email != ""){
        clevertap.onUserLogin.push({
            "Site": {
              "Name": name,
              "Identity": identity,              // String or number
              "Email": email,
              "Phone": phone,
           // optional fields. controls whether the user will be sent email, push etc.
              "MSG-email": true,                // Disable email notifications
              "MSG-push": true,                  // Enable push notifications
              "MSG-sms": true,                   // Enable sms notifications
              "MSG-whatsapp": true,              // Enable WhatsApp notifications
            }
           })

        window.console.error("OnUserLogin Called with variables "+name+", "+email+", "+identity+", "+phone);
    }
    
}
var down = document.getElementById("pushDown");
var itemcounter1 = document.getElementById("itemCounter1");
var itemcounter2 = document.getElementById("itemCounter2");

function pushPlus(){
    pushcount++;
    var key = document.createElement("input");
    key.setAttribute("type","text");
    key.setAttribute("class","w3-input w3-border");
    key.setAttribute("required","true");
    key.setAttribute("id","key"+pushcount);

    var val = document.createElement("input");
    val.setAttribute("type","text");
    val.setAttribute("class","w3-input w3-border");
    val.setAttribute("required","true");
    val.setAttribute("id","val"+pushcount);

    var lab = document.createElement("label");
    lab.setAttribute("id","labkey"+pushcount);
    lab.innerText = "Key "+pushcount;

    var lab1 = document.createElement("label");
    lab1.setAttribute("id","labval"+pushcount);
    lab1.innerText = "Value "+pushcount;

    var divhalf = document.createElement("div");
    divhalf.setAttribute("id","divhalf"+pushcount);
    divhalf.setAttribute("class","w3-half w3-margin-bottom");

    var divhalf1 = document.createElement("div");
    divhalf1.setAttribute("id","divhalf1"+pushcount);
    divhalf1.setAttribute("class","w3-half");

    var divrow = document.createElement("div");
    divrow.setAttribute("id","pushdivrow"+pushcount);
    divrow.setAttribute("class","w3-row-padding");
    divrow.setAttribute("style","margin:0 -16px;");
    
    down.appendChild(divrow);
    divrow.appendChild(divhalf);
    divhalf.appendChild(lab);
    divhalf.appendChild(key);
    divrow.appendChild(divhalf1);
    divhalf1.appendChild(lab1);
    divhalf1.appendChild(val);
}

function pushMinus(){
    if(pushcount > 1){

        const divrow = document.getElementById("pushdivrow"+pushcount);
        const divhalf = document.getElementById("divhalf"+pushcount);
        const divhalf1 = document.getElementById("divhalf1"+pushcount);
        const labkey = document.getElementById("labkey"+pushcount);
        const labval = document.getElementById("labval"+pushcount);
        const key = document.getElementById("key"+pushcount);
        const val = document.getElementById("val"+pushcount);

        val.remove();
        key.remove();
        labval.remove();
        labkey.remove();
        divhalf.remove();
        divhalf1.remove();
        divrow.remove();
        
        pushcount--;
    }
    else{
        alert("Minimum One User property feild must exsist.");
        console.debug("Push Count is "+pushcount+" and still trying to reduce the user property feild.");
    }
}

function pushClicked(){
    var count = pushcount;
    var pushDict = {};

    for (let i = 1; i <= count; i++) {
        var key = document.getElementById("key"+i).value;
        var val = document.getElementById("val"+i).value;

        pushDict[key] = val;
    }
    clevertap.profile.push({
        "Site": pushDict
       });

}

function webpushClicked(){
    clevertap.event.push("Web Push");
}

function popupClicked(){
    clevertap.event.push("Web Pop-up");
}

function itemPlus() {

    itemcount2++;
    var divrow = document.createElement("div");
    divrow.setAttribute("id","itemdivrow"+itemcount2);
    divrow.setAttribute("class","w3-row-padding w3-center");
    
    var ptag1 = document.createElement("p");
    ptag1.setAttribute("class","w3-col s4");
    ptag1.setAttribute("id","p1"+itemcount2)

    var ptag2 = document.createElement("p");
    ptag2.setAttribute("class","w3-col s4");
    ptag2.setAttribute("id","p2"+itemcount2)

    var ptag3 = document.createElement("p");
    ptag3.setAttribute("class","w3-col s4");
    ptag3.setAttribute("id","p3"+itemcount2)

    var item = document.createElement("input");
    item.setAttribute("class","w3-input w3-border");
    item.setAttribute("placeholder","Item Name");
    item.setAttribute("id","item"+itemcount2);

    var category = document.createElement("input");
    category.setAttribute("class","w3-input w3-border");
    category.setAttribute("placeholder","Category");
    category.setAttribute("id","cat"+itemcount2);

    var quan = document.createElement("input");
    quan.setAttribute("class","w3-input w3-border");
    quan.setAttribute("placeholder","Quantity");
    quan.setAttribute("id","quan"+itemcount2);

    itemcounter2.appendChild(divrow);
    divrow.appendChild(ptag1);
    divrow.appendChild(ptag2);
    divrow.appendChild(ptag3);
    ptag1.appendChild(item);
    ptag2.appendChild(category);
    ptag3.appendChild(quan);

}

function itemMinus() {
    if (itemcount2 > 1) {
        
        const divrow = document.getElementById("itemdivrow"+itemcount2);
        const ptag1 = document.getElementById("p1"+itemcount2);
        const ptag2 = document.getElementById("p2"+itemcount2);
        const ptag3 = document.getElementById("p3"+itemcount2);
        const item = document.getElementById("item"+itemcount2);
        const category = document.getElementById("cat"+itemcount2);
        const quan = document.getElementById("quan"+itemcount2);

        divrow.remove();
        ptag1.remove();
        ptag2.remove();
        ptag3.remove();
        item.remove();
        category.remove();
        quan.remove();

        itemcount2--;

    } else {
        alert("Minimum One Item Detail Should be Passed with Charged Event.");
        console.debug("Charged Item Count is "+itemcount2+" and still trying to reduce the items feild.");
    }
}

function chargeClicked() {
    var chargeAmt = document.getElementById("chargeAmt").value;
    var chargeMode = document.getElementById("chargeMode").value;
    var chargeId = document.getElementById("chargeId").value;

    var count = itemcount2;
    var chargeDict = {};
    var chargeArr = [];

    for (let i = 1; i <= count; i++) {
        var item = document.getElementById("item"+i).value;
        var category = document.getElementById("cat"+i).value;
        var quan = document.getElementById("quan"+i).value;
        
        chargeDict["Item Name"] = item;
        chargeDict["Category"] = category;
        chargeDict["Quantity"] = quan;

        chargeArr[i] = chargeDict;
    }

    clevertap.event.push("Charged", {
        "Amount": chargeAmt,
        "Payment mode": chargeMode,
        "Transaction ID": chargeId,
        "Items": chargeArr
    });
}

function itemPlusEvt() {

    itemcount1++;
    var divrow = document.createElement("div");
    divrow.setAttribute("id","evtdivrow"+itemcount1);
    divrow.setAttribute("class","w3-row-padding w3-center");
    
    var ptag1 = document.createElement("p");
    ptag1.setAttribute("class","w3-half s4");
    ptag1.setAttribute("id","evtp1"+itemcount1)

    var ptag2 = document.createElement("p");
    ptag2.setAttribute("class","w3-half s4");
    ptag2.setAttribute("id","evtp2"+itemcount1)

    var propName = document.createElement("input");
    propName.setAttribute("class","w3-input w3-border");
    propName.setAttribute("placeholder","Event Property Name");
    propName.setAttribute("id","propName"+itemcount1);

    var propVal = document.createElement("input");
    propVal.setAttribute("class","w3-input w3-border");
    propVal.setAttribute("placeholder","Event Property Value");
    propVal.setAttribute("id","propVal"+itemcount1);

    itemcounter1.appendChild(divrow);
    divrow.appendChild(ptag1);
    divrow.appendChild(ptag2);
    ptag1.appendChild(propName);
    ptag2.appendChild(propVal);

}

function itemMinusEvt() {
    if (itemcount1 > 1) {
        
        const divrow = document.getElementById("evtdivrow"+itemcount1);
        const ptag1 = document.getElementById("evtp1"+itemcount1);
        const ptag2 = document.getElementById("evtp2"+itemcount1);
        const propName = document.getElementById("propName"+itemcount1);
        const propVal = document.getElementById("propVal"+itemcount1);

        divrow.remove();
        ptag1.remove();
        ptag2.remove();
        propName.remove();
        propVal.remove();

        itemcount1--;

    } else {
        alert("Minimum One Event Propert Should be Passed with Event.");
        console.debug("Event Property Count is "+itemcount1+" and still trying to reduce the items feild.");
    }
}

function EvtBtnClicked() {
    var evtName = document.getElementById("evtName").value;


    var count = itemcount2;
    var evtDict = {};
    var evtArr = [];
    

    for (let i = 1; i <= count; i++) {
        var propName = document.getElementById("propName"+i).value;
        var propVal = document.getElementById("propVal"+i).value;
        
        evtDict[propName] = propVal;

        evtArr[i] = evtDict;
    }

    if (window.Clevertap) {
        // Call Android interface for Web View             
        Clevertap.pushEvent(evtName,evtDict);          
    }
    else{
        clevertap.event.push(evtName,evtDict);
    }
    
}

function initAccClicked() {
    var accId = document.getElementById("accId").value;
    var reg1 = document.getElementById("reg1").value;

    var clevertap = {event:[], profile:[],region :reg1, account:[], onUserLogin:[], notifications:[], privacy:[]};
    clevertap.account.push({"id": accId});
    clevertap.privacy.push({optOut: false}); 
    clevertap.privacy.push({useIP: false});
    (function () {
        var wzrk = document.createElement('script');
        wzrk.type = 'text/javascript';
        wzrk.async = true;
        wzrk.src = ('https:' == document.location.protocol ? 'https://d2r1yp2w7bby2u.cloudfront.net' : 'http://static.clevertap.com') + '/js/a.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wzrk, s);
    })();

}
