import { useState } from "react";
import UpdateExistingPasswordForm from "../components/Forms/UpdateExistingPasswordForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import UserCard from "../components/Cards/UserCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/Providers/UserProvider";
import UpdateExistingEmailForm from "../components/Forms/UpdateExistingEmailForm";
import CreateModal from "../components/Modals/CreateModal";
import CreateUserForm from "../components/Forms/CreateUserForm";

const AccountSettings = () => {
  const { getCurrentUser } = useUser();
  const currentUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState<string | false>(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] =
    useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <Grid container justifyContent="center" columnGap={3}>
      <Grid
        item
        xs={1}
        display={{ xs: "none", sm: "none", md: "none", lg: "flex" }}
        sx={{
          position: "sticky",
          top: "5%",
          height: "min-content",
          justifyContent: "end",
          borderRadius: "3px",
        }}
      >
        <Button
          variant="contained"
          color="inherit"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
        </Button>
      </Grid>
      <Grid
        item
        xs={12}
        lg={3.5}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Accordion
          expanded={activeTab === "email"}
          onChange={() =>
            setActiveTab((activeTab) =>
              activeTab === "email" ? false : "email"
            )
          }
          slotProps={{ transition: { unmountOnExit: true } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="email-content"
            id="email-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              Change Email
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {currentUser?.email}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ width: "fit-content", margin: "auto" }}>
            <UpdateExistingEmailForm user={currentUser} />
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={activeTab === "password"}
          onChange={() =>
            setActiveTab((activeTab) =>
              activeTab === "password" ? false : "password"
            )
          }
          slotProps={{ transition: { unmountOnExit: true } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="password-content"
            id="password-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              Password
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Change Pasword
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ width: "fit-content", margin: "auto" }}>
            <UpdateExistingPasswordForm />
            <Typography variant="caption" color="text.secondary">
              Don't have a password?{" "}
            </Typography>
            <Button
              variant="text"
              color="primary"
              onClick={() => setOpenResetPasswordModal(true)}
            >
              Reset Password
            </Button>
          </AccordionDetails>
        </Accordion>
      </Grid>
      {/* <UserCard
            user={currentUser}
            hover
            width={"100%"}
            height={"fit-content"}
            loading={false}
            backgroundColor="white"
          /> */}
      <Grid
        item
        xs={2.5}
        display={{ xs: "none", sm: "none", md: "none", lg: "grid" }}
        sx={{
          height: "fit-content",
        }}
      >
        {currentUser && (
          <UserCard
            user={currentUser}
            hover
            width={"330px"}
            loading={false}
            backgroundColor="white"
          />
        )}
      </Grid>
      {openResetPasswordModal && (
        <CreateModal
          openModal={openResetPasswordModal}
          setOpenModal={setOpenResetPasswordModal}
          width={"400px"}
          Children={
            <CreateUserForm
              setOpenModal={setOpenResetPasswordModal}
              forgetPassword
            />
          }
        />
      )}
    </Grid>
  );
};

export default AccountSettings;
