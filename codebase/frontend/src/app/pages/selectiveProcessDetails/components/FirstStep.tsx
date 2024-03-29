import { Row } from "@/app/shared/styled";
import { Button, Typography } from "@mui/material";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useApi, useFiles, useSnackbar } from "@/app/shared/hooks";
import { ProcessFirstStepReqData, uploadFirstStepService } from "@/services";
import { UploadFile } from "@/app/shared/components";
import { UploadFileProps } from "@/app/shared/components/UploadFile/UploadFile";
import { useAppStore } from "@/app/shared/stores";

const fileHelperDialogData: UploadFileProps["fileHelperDialog"] = {
  dialogTitle: "Formato do arquivo de candidatos",
  fileFormat: "ods",
  fileMaxSize: 10,
  fileFields: [
    "numCandidato",
    "cpf",
    "corRaca",
    "cargoId",
    "formacaoEscolaPublica",
    "dataInscricao",
    "programa",
    "tipoPrograma",
    "nomeComunidade",
    "anoEnem",
  ],
};

const FirstStep = ({
  processId,
  setProcessDetails,
}: {
  processId: string;
  setProcessDetails: (processDetails: any) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const { getBase64 } = useFiles();
  const { openSnackbar } = useSnackbar();
  const api = useApi();
  const { openBackdropLoading, closeBackdropLoading } = useAppStore();

  const handleConfirmUpload = async (e: React.MouseEvent<HTMLElement>) => {
    if (!file) {
      openSnackbar("Faça o upload do arquivo", "error");
      return;
    }

    try {
      const fileBase64 = await getBase64(file);
      const data: ProcessFirstStepReqData = {
        base64: fileBase64,
        processID: processId,
      };
      openBackdropLoading();
      const res = await uploadFirstStepService(api, data);
      setTimeout(() => {
        setProcessDetails(res.data?.processData);
        closeBackdropLoading();
        openSnackbar("Etapa 1 concluída", "success");
      }, 1000);
    } catch (err) {
      closeBackdropLoading();
      openSnackbar("Falha no upload", "error");
    }
  };

  return (
    <>
      <Typography variant="h5" mb={3}>
        Upload de Candidaturas
      </Typography>
      <UploadFile
        file={file}
        setFile={setFile}
        primaryText="Para dar continuidade no processo seletivo, você precisa realizar o upload do arquivo (.ods) com os dados de candidatura dos participantes."
        fileHelperDialog={fileHelperDialogData}
      />
      <Row justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          sx={{ minWidth: "320px" }}
          onClick={handleConfirmUpload}
        >
          Confirmar
        </Button>
      </Row>
    </>
  );
};

export default FirstStep;
