"use client";
import { store } from "@/redux/store";
import { Toast } from "@heroui/react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/redux/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toast.Provider placement="top" />
        {children}
      </PersistGate>
    </Provider>
  );
}
