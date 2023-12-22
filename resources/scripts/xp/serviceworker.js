import axios from 'axios';

const serviceworker = {
    register() {
        if(!("serviceWorker" in navigator)) {
            console.log("[serviceworker] worker not available in navigator");
            return;
        }

        axios.get('/sw').then(response => {
            const url = response.request.responseURL;

            console.log(`[serviceworker] registering service worker on ${url}...`);
            navigator.serviceWorker.register(url, {
                scope: "/"
            }).then(registration => {
                if(registration.installing) {
                    console.log("[serviceworker] installing worker...");
                } else if(registration.waiting) {
                    console.log("[serviceworker] worker installed");
                } else if(registration.active) {
                    console.log("[serviceworker] worker activated");
                }
            }).catch(e => {
                console.log(`[serviceworker] worker registration error: ${e}`);
            });
        });
    }
};

export default serviceworker;