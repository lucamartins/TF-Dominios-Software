import {
  AnalystUser,
  deleteAnalystService,
  GetAnalystUsersResponse,
} from "@/services/users";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useApi, useSnackbar } from "@/app/shared/hooks";
import { useEffect, useState } from "react";
import { getAnalytsUsersService } from "@/services/users/get";
import { ConfirmationDialog } from "@/app/shared/components";
import { ConfirmationDialogProps } from "@/app/shared/components/ConfirmationDialog/ConfirmationDialogTypes";

const AnalystUsersList = ({
  refetch,
  shouldRefetch,
}: {
  refetch: () => void;
  shouldRefetch: number;
}) => {
  const api = useApi();
  const [analysts, setAnalysts] = useState<GetAnalystUsersResponse>([]);
  const [confirmDeletionModalOpen, setConfirmDeletionModalOpen] =
    useState(false);
  const [confirmationDialogProps, setConfirmationDialogProps] =
    useState<ConfirmationDialogProps | null>();
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      try {
        const res = await getAnalytsUsersService(api);
        setAnalysts(res.data);
      } catch (error) {
        openSnackbar("Falha ao obter analistas", "error");
      }
    })();
  }, [shouldRefetch]);

  const handleOpenDeleteDialog = ({ nome, email, id }: AnalystUser) => {
    setConfirmationDialogProps({
      message: `Você tem certeza que deseja remover o acesso de ${nome} (${email})?`,
      handleClose: () => setConfirmDeletionModalOpen(false),
      handleConfirm: () => handleDeleteAnalyst(String(id)),
    });
    setConfirmDeletionModalOpen(true);
  };

  const handleDeleteAnalyst = async (analystId: string) => {
    try {
      await deleteAnalystService(api, analystId);
      openSnackbar("Analista excluído com sucesso", "success");
      setConfirmDeletionModalOpen(false);
      refetch();
    } catch (err) {
      openSnackbar("Falha ao excluir analista", "error");
    }
  };

  return (
    <>
      {!!analysts.length && (
        <Paper variant="outlined">
          <List>
            {analysts.map((user, ind) => (
              <Box key={user.id}>
                <ListItem>
                  <ListItemText>{user.nome}</ListItemText>
                  <ListItemText>{user.email}</ListItemText>
                  <Button
                    variant="outlined"
                    endIcon={<DeleteOutlineIcon />}
                    onClick={() => handleOpenDeleteDialog(user)}
                  >
                    Excluir Acesso
                  </Button>
                </ListItem>
                {ind !== analysts.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Paper>
      )}
      {!analysts.length && (
        <Typography variant="body1">
          Nenhum usuário analista encontrado.
        </Typography>
      )}
      {confirmDeletionModalOpen && confirmationDialogProps && (
        <ConfirmationDialog {...confirmationDialogProps} />
      )}
    </>
  );
};

export default AnalystUsersList;
