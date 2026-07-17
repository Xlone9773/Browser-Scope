import { useToastContext, ToastContextType } from "../components/ui/Toast";

export const useToast = (): ToastContextType => {
  return useToastContext();
};
