var pageDict = { PageName: "JBuy Home" };
var PIPVideo, JBuy_Home;

function homeReorder(JBuyHome) {
    const container = document.getElementById("mainContainer");

    // Convert sectionOrder to an array of [id, position] and sort by position
    const orderedSections = Object.entries(JBuyHome)
        .sort((a, b) => a[1] - b[1]) // Sort by position value
        .map(([id]) => document.getElementById(id)); // Get DOM elements
    console.log(orderedSections);
    // Append elements in new order
    orderedSections.forEach(section => {
        if (section) {
            container.appendChild(section); // Re-appends (moves) section in order
        }
    });

}

function defineVariable() {

    PIPVideo = clevertap.defineVariable("PIPVideo", "{\"enabled\":false,\"video_url\":\"NA\",\"position\":\"NA\",\"redirect_url\":\"NA\"}");
    BulletNudge = clevertap.defineVariable("BulletNudge", "{\"enabled\":false,\"title\":\"EOSSale\",\"time\":\"\",\"redirect_url\":\"https://jits-clever.github.io/TestWeb/\",\"bg_colour\":\"\",\"icon_url\":\"\",\"title_color\":\"\",\"timer_color\":\"\"}");
    JBuy_Home = clevertap.defineVariable("JBuy_Home", "{\"heroCarousel\": 1,\"specialOffer\": 2,\"topCategories\": 3,\"topProducts\": 4,\"featuredBrands\": 5}");

}

function raisePageView(pageDict) {
    var evProperties = { "Page Name": pageDict["PageName"], "source": pageDict["source"], "AppVersion": pageDict["appVersion"] }
    if (window.CleverTap) {
        CleverTap.pushEvent("Page Viewed", JSON.stringify(evProperties));
    } else {
        clevertap.event.push("Page Viewed", evProperties)
    }

}

document.addEventListener("DOMContentLoaded", function () {
    if (window.jBuyBridge && typeof jBuyBridge.getAppData === "function") {
        try {
            const appData = JSON.parse(jBuyBridge.getAppData());
            console.log("From Android:", appData);

            // Correct way to merge appData into pageDict
            for (let key in appData) {
                if (appData.hasOwnProperty(key)) {
                    pageDict[key] = appData[key];
                    console.log(key, appData[key]);
                }
            }
        } catch (e) {
            console.error("Failed to parse app data from Android:", e);
        }
    }

    // Optional: delay clevertap login call slightly to ensure pageDict is updated
    if ("identity" in pageDict) {
        clevertap.onUserLogin.push({
            "Site": {
                "Identity": pageDict["identity"]
            }
        });
    }
    clevertap.setLogLevel(4);
    raisePageView(pageDict);

    defineVariable();
    clevertap.syncVariables(
        // Success callback function  
        () => { console.log('Sync successful'); },

        // Failure callback function  
        () => { console.log('Sync failed'); }
    );
    clevertap.fetchVariables(
        () => {
            console.log("Fetch successful");
            homeReorder(JSON.parse(JBuy_Home.getValue()));
        }
    );


});
