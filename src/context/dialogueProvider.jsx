import {produce} from "immer"
import React from "react";
import PropTypes from "prop-types";

export const Dialog = React.createContext(null);
Dialog.displayName = "DialogContext";

export function reducer(state, action) {

  let nextState

  switch (action.type) {

    case "SET_DIALOG": {

      nextState = produce(state, draftState => {
          draftState.active = action.value.active
          draftState.view = action.value.view
          draftState.value = action.value.value
      })
      // console.log(nextState);
      return nextState || state;
        // return { ...state, ...action.value }
    }

    case "SET_BACKDROP": {

      nextState = produce(state, draftState => {
        draftState.backdropActive = action.value
      })
      // console.log(nextState);
      return nextState || state;
        // return { ...state, ...action.value }
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }

  }
}



export function DialogControllerProvider({ children }) {

    const initialState = {
      active: false,
      view: null,
      value: null,
      backdropActive: false
    };

  const [controller, dispatch] = React.useReducer(reducer, initialState);

  const value = React.useMemo(
    () => [controller, dispatch],
    [controller, dispatch]
  );

  return (
    <Dialog.Provider value={value}>
      {children}
    </Dialog.Provider>
  );

}


export function useDialogController() {

  const context = React.useContext(Dialog);

  if (!context) {
    throw new Error(
      "useDialogController should be used inside the DialogControllerProvider."
    );
  }

  return context;
}


DialogControllerProvider.displayName = "/src/context/dialogueProvider.jsx";
DialogControllerProvider.propTypes = {children: PropTypes.node.isRequired};
