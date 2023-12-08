import api from '@scripts/xp/api';
import serviceworker from '@scripts/xp/serviceworker';
import sequencerenderer from './xp/sequencerenderer';


const xp = {
    api,
    serviceworker,
    sequencerenderer,

    register() {
        serviceworker.register();
    }
};

export default xp;