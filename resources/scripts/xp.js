import api from '@scripts/xp/api';
import serviceworker from '@scripts/xp/serviceworker';

const xp = {
    api,
    serviceworker,

    register() {
        serviceworker.register();
    }
};

export default xp;