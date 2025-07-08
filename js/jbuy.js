var pageDict = { PageName: "JBuy Home" };
var PIPVideo;

function defineVariable() {

    PIPVideo = clevertap.defineVariable("PIPVideo", "{\"enabled\":false,\"video_url\":\"NA\",\"position\":\"NA\",\"redirect_url\":\"NA\"}");
    BulletNudge = clevertap.defineVariable("BulletNudge", "{\"enabled\":false,\"title\":\"EOSSale\",\"time\":\"\",\"redirect_url\":\"https://jits-clever.github.io/TestWeb/\",\"bg_colour\":\"\",\"icon_url\":\"\",\"title_color\":\"\",\"timer_color\":\"\"}");


}

function raisePageView(pageDict) {
    var evProperties = { "Page Name": pageDict["PageName"], "source":pageDict["source"],"AppVersion":pageDict["appVersion"]}
    if (window.CleverTap) {
        CleverTap.pushEvent("Page Viewed",JSON.stringify(evProperties));
    } else {
        clevertap.event.push("Page Viewed",evProperties)
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
    raisePageView(pageDict);

    defineVariable();
    clevertap.fetchVariables(
        () => {
            console.log("Fetch successful");
            // if (PIPVideo) {
            //     const PIPvalue = PIPVideo.getValue();
            //     const NudgeValue = BulletNudge.getValue();

            //     try {
            //         if (window.jBuyBridge && jBuyBridge.triggerPiP && jBuyBridge.triggerBullet) {
            //             jBuyBridge.triggerPiP(PIPvalue);
            //             jBuyBridge.triggerBullet(NudgeValue);
            //         } else {

            //         }
            //     } catch (err) {
            //         console.error("Error parsing PIPVideo value:", err);
            //     }
            // }
        }
    );


});
