import { useContext } from "react";
import { DialogueContext } from "@/context/dialogueProvider";

export function useDialog() {

    const context = useContext(DialogueContext);

    console.log(context);
  
    if (!context) {
    //   throw new Error(
    //     "useMaterialTailwindController should be used inside the MaterialTailwindControllerProvider."
    //   );
    }
  
    return context;
}
