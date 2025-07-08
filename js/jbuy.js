var pageDict = { PageName: "JBuy Home" };
var PIPVideo; 

function defineVariable() {

    PIPVideo = clevertap.defineVariable("PIPVideo", "{\"enabled\":false,\"video_url\":\"NA\",\"position\":\"NA\",\"redirect_url\":\"NA\"}")


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

    defineVariable();
     clevertap.fetchVariables(
        () => {
            console.log("Fetch successful");
            if (PIPVideo) {
                const value = PIPVideo.getValue();
                console.log("PIPVideo value:", value);

                try {
                    const parsed = JSON.parse(value);
                    if (window.jBuyBridge && jBuyBridge.triggerPiP) {
                        jBuyBridge.triggerPiP(value);
                    } else {
                        
                    }
                } catch (err) {
                    console.error("Error parsing PIPVideo value:", err);
                }
            }
        }
    );


});
