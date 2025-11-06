import { useContext } from "react";
import { AddressContext } from "../context/AddressProvider";

export const useAddressContext = () => {
  const context = useContext(AddressContext);
  if (!context)
    throw new Error("useAddressContext deve ser usado dentro de um <AddressProvider>");
  return context;
};
