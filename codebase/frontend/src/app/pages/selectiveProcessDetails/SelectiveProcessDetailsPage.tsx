import {
  Button,
  CircularProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Row } from "@/app/shared/styled";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { useEffect, useState } from "react";
import { FirstStep, Result, SecondStep, ThirdStep } from "./components";

const steps = ["Candidaturas", "Notas ENEM", "Notas VHCE", "Resultado"];

interface StateProps {
  processDetails: {
    id: string;
    ano: number;
    inicio: string;
    termino: string;
    etapa: number;
  };
}

const SelectiveProcessDetailsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [processDetails, setProcessDetails] =
    useState<StateProps["processDetails"]>();

  useEffect(() => {
    if (state) {
      const { processDetails } = state as StateProps;
      setProcessDetails(processDetails);
    } else {
      navigate("/");
    }
  }, [state]);

  if (!processDetails)
    return (
      <Row justifyContent="center" alignItems="center">
        <CircularProgress />
      </Row>
    );

  const stepsComponents = [
    <FirstStep
      processId={processDetails.id}
      setProcessDetails={setProcessDetails}
    />,
    <SecondStep
      processId={processDetails.id}
      setProcessDetails={setProcessDetails}
    />,
    <ThirdStep
      processId={processDetails.id}
      setProcessDetails={setProcessDetails}
    />,
    <Result processId={processDetails.id} />,
  ];

  return (
    <>
      <Button
        startIcon={<ArrowBackIosIcon />}
        variant="text"
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Voltar
      </Button>
      <Row alignItems="center" mb="30px">
        <TrackChangesIcon sx={{ height: 50, width: 50, mr: "15px" }} />
        <Typography variant="h2">
          Processo Seletivo UFG Inclui {processDetails.ano}
        </Typography>
      </Row>

      <Paper sx={{ p: "30px 20px", mb: "70px" }}>
        <Stepper activeStep={processDetails.etapa - 1}>
          {steps.map((step) => (
            <Step key={step}>
              <StepLabel>{step}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {stepsComponents[processDetails.etapa - 1]}
    </>
  );
};

export default SelectiveProcessDetailsPage;
