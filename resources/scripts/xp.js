import api from '@scripts/xp/api';
import renderer from '@scripts/xp/renderer';
import serviceworker from '@scripts/xp/serviceworker';

const xp = {
    api,
    renderer,
    serviceworker,

    register() {
        serviceworker.register();
    }
};

export default xp;