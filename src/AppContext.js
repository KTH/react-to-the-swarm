import React, { createContext } from "react";
import {useLocalStore} from 'mobx-react';
const ctx = createContext();

function AppContext(props) {

    const store = useLocalStore(() => ({
        shownServiceId: null,
        setShownServiceId: (serviceId) => {
            store.shownServiceId = serviceId;
        }
    }));
    return (
        <ctx.Provider value={store}>{props.children}</ctx.Provider>
    );
}

export { AppContext };

export default ctx;

