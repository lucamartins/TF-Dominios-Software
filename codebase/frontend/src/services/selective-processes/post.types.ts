import { SelectiveProcess } from "./get.types";

export interface AddProcessReqData {
  ano: number;
  inicio: string;
  termino: string;
}

export interface ProcessFirstStepReqData {
  processID: string;
  base64: string;
}

export interface ProcessFirstStepResData {
  message: string;
  processData: SelectiveProcess;
}