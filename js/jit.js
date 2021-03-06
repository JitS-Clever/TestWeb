// For OnUserLogin Function Button Click
var pushcount = 1;
var itemcount = 1;



function start(){
    var label = document.getElementById("ctid");
    label.innerHTML = "Clevertap id is : " + clevertap.getCleverTapID();
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
var itemcounter = document.getElementById("itemCounter");

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

    itemcount++;
    var divrow = document.createElement("div");
    divrow.setAttribute("id","itemdivrow"+itemcount);
    divrow.setAttribute("class","w3-row-padding w3-center");
    
    var ptag1 = document.createElement("p");
    ptag1.setAttribute("class","w3-col s4");
    ptag1.setAttribute("id","p1"+itemcount)

    var ptag2 = document.createElement("p");
    ptag2.setAttribute("class","w3-col s4");
    ptag2.setAttribute("id","p2"+itemcount)

    var ptag3 = document.createElement("p");
    ptag3.setAttribute("class","w3-col s4");
    ptag3.setAttribute("id","p3"+itemcount)

    var item = document.createElement("input");
    item.setAttribute("class","w3-input w3-border");
    item.setAttribute("placeholder","Item Name");
    item.setAttribute("id","item"+itemcount);

    var category = document.createElement("input");
    category.setAttribute("class","w3-input w3-border");
    category.setAttribute("placeholder","Category");
    category.setAttribute("id","cat"+itemcount);

    var quan = document.createElement("input");
    quan.setAttribute("class","w3-input w3-border");
    quan.setAttribute("placeholder","Quantity");
    quan.setAttribute("id","quan"+itemcount);

    itemcounter.appendChild(divrow);
    divrow.appendChild(ptag1);
    divrow.appendChild(ptag2);
    divrow.appendChild(ptag3);
    ptag1.appendChild(item);
    ptag2.appendChild(category);
    ptag3.appendChild(quan);

}

function itemMinus() {
    if (itemcount > 1) {
        
        const divrow = document.getElementById("itemdivrow"+itemcount);
        const ptag1 = document.getElementById("p1"+itemcount);
        const ptag2 = document.getElementById("p2"+itemcount);
        const ptag3 = document.getElementById("p3"+itemcount);
        const item = document.getElementById("item"+itemcount);
        const category = document.getElementById("cat"+itemcount);
        const quan = document.getElementById("quan"+itemcount);

        divrow.remove();
        ptag1.remove();
        ptag2.remove();
        ptag3.remove();
        item.remove();
        category.remove();
        quan.remove();

        itemcount--;

    } else {
        alert("Minimum One Item Detail Should be Passed with Charged Event.");
        console.debug("Charged Item Count is "+itemcount+" and still trying to reduce the items feild.");
    }
}

function chargeClicked() {
    var chargeAmt = document.getElementById("chargeAmt").value;
    var chargeMode = document.getElementById("chargeMode").value;
    var chargeId = document.getElementById("chargeId").value;

    var count = itemcount;
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