
const serviceworker = {
    register() {
        if(!("serviceWorker" in navigator)) {
            console.log("sw not available in navigator");
            return;
        }

        navigator.serviceWorker.register('/sw', {
            scope: "/"
        }).then(registration => {
            if(registration.installing) {
                console.log("sw installing");
            } else if(registration.waiting) {
                console.log("sw installed");
            } else if(registration.active) {
                console.log("sw active");
            }
        }).catch(e => {
            console.log(`sw registration error: ${e}`);
        });
    }
};

export default serviceworker;