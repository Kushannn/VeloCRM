"use client";
import { store } from "@/redux/store";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/redux/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HeroUIProvider>
          <ToastProvider placement="top-center" />
          {children}
        </HeroUIProvider>
      </PersistGate>
    </Provider>
  );
}
