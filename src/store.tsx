import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, X } from "lucide-react";
import type { AccountType, WorkspaceData } from "./types";
import { createDemo, todayISO, uid } from "./data/demo";
type Store = {
  account: AccountType;
  switchAccount: (a: AccountType) => void;
  data: WorkspaceData;
  update: (fn: (d: WorkspaceData) => WorkspaceData) => void;
  notify: (message: string) => void;
  log: (message: string) => void;
  reset: () => void;
};
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AccountType>("advocate");
  const [workspaces, setWorkspaces] = useState<
    Record<AccountType, WorkspaceData>
  >(() => ({
    advocate: createDemo("advocate"),
    personal: createDemo("personal"),
  }));
  const [toast, setToast] = useState("");
  const update = useCallback(
    (fn: (d: WorkspaceData) => WorkspaceData) =>
      setWorkspaces((previous) => ({
        ...previous,
        [account]: fn(previous[account]),
      })),
    [account],
  );
  const notify = useCallback((message: string) => setToast(message), []);
  const log = useCallback(
    (message: string) =>
      update((d) => ({
        ...d,
        activity: [
          { id: uid(), text: message, date: todayISO() },
          ...d.activity,
        ].slice(0, 20),
      })),
    [update],
  );
  const switchAccount = (a: AccountType) => {
    setAccount(a);
    setToast(
      `${a === "advocate" ? "Chamber" : "Personal"} demo workspace opened.`,
    );
  };
  return (
    <Context.Provider
      value={{
        account,
        switchAccount,
        data: workspaces[account],
        update,
        notify,
        log,
        reset: () =>
          setWorkspaces({
            advocate: createDemo("advocate"),
            personal: createDemo("personal"),
          }),
      }}
    >
      {children}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={17} />
          <span>{toast}</span>
          <button
            className="icon-button"
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
export function useStore() {
  const context = useContext(Context);
  if (!context) throw new Error("Workspace provider is missing");
  return context;
}
