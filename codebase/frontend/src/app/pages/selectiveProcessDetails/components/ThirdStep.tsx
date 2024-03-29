import { Col, Row } from "@/app/shared/styled";
import { Button, Paper, Typography } from "@mui/material";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useApi, useFiles, useSnackbar } from "@/app/shared/hooks";
import {
  getCPFsThirdStepService,
  ProcessFirstStepReqData,
  uploadThirdStepService,
} from "@/services";
import { UploadFile } from "@/app/shared/components";
import download from "downloadjs";
import { UploadFileProps } from "@/app/shared/components/UploadFile/UploadFile";
import { useAppStore } from "@/app/shared/stores";

const fileHelperDialogData: UploadFileProps["fileHelperDialog"] = {
  dialogTitle: "Formato do arquivo das notas ENEM",
  fileFormat: "ods",
  fileMaxSize: 10,
  fileFields: ["cpfCandidato", "n1", "n2", "ntotal"],
};

const ThirdStep = ({
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
      const res = await uploadThirdStepService(api, data);
      setTimeout(() => {
        closeBackdropLoading();
        setProcessDetails(res.data?.processData);
        openSnackbar("Etapa 3 concluída", "success");
      }, 1000);
    } catch (err) {
      closeBackdropLoading();
      openSnackbar("Falha no upload", "error");
    }
  };

  const handleDownloadCPFs = async () => {
    try {
      const res = await getCPFsThirdStepService(api, processId);
      const blob = await res.data;
      download(blob, `CPFs-VHCE-${processId}.txt`);
    } catch (err) {
      openSnackbar("Falha ao obter documento", "error");
    }
  };

  return (
    <>
      <Typography variant="h5" mb={3}>
        Upload das notas VHCE dos participantes
      </Typography>
      <Paper sx={{ mb: 2, p: 2 }} variant="outlined">
        <Col alignItems="center">
          <Typography variant="body1" p={2}>
            Clique no botão abaixo para obter o arquivo com os CPFs dos
            participantes.
          </Typography>
          <Button onClick={handleDownloadCPFs}>Obter CPFs</Button>
        </Col>
      </Paper>
      <UploadFile
        file={file}
        setFile={setFile}
        primaryText="Para dar continuidade no processo seletivo, você precisa realizar o upload do arquivo (.ods) com as notas VHCE dos participantes."
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

export default ThirdStep;
