import { CheckIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Flex,
  Modal,
  Select,
  TextInput,
  createStyles,
} from "@mantine/core";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { DEMO_TOKENS, LOCAL_STORAGE_SETTINGS_KEY } from "../constants";
import { settingsSchema } from "../validation";
import { extractLocalStorageSettings } from "../helpers";

const useStyles = createStyles((theme) => ({
  modal: {
    position: "absolute",
    width: "300px",
    inset: 0,
    "& .mantine-Modal-title": {
      fontSize: "18px",
      fontWeight: "bold",
    },
  },
}));

type FormState = {
  address: string;
  token: string;
  username: string;
  apiKey: string;
};

type SettingsProps = {
  opened: boolean;
  handleClose: () => void;
};

export const Settings = ({ opened, handleClose }: SettingsProps) => {
  const methods = useForm<FormState>({
    reValidateMode: "onChange",
    defaultValues: {
      ...extractLocalStorageSettings(),
    } as FormState,
    resolver: zodResolver(settingsSchema),
  });

  const { formState, handleSubmit, reset } = methods;

  const errors = formState.errors;

  const { classes } = useStyles();

  const onSubmit = (data: FormState) => {
    console.log(data);
    const { address, token, username, apiKey } = methods.getValues();
    localStorage.setItem(
      LOCAL_STORAGE_SETTINGS_KEY,
      JSON.stringify({
        address,
        token,
        username,
        apiKey,
      }),
    );
    handleClose();
  };

  const onClose = () => {
    reset();
    handleClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Settings"
      className={classes.modal}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" mt={32}>
            <Flex direction="column" gap={8} mb={16}>
              <Controller
                name="address"
                control={methods.control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label="Address"
                    error={errors.address?.message}
                  />
                )}
              />
              <Controller
                name="token"
                control={methods.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Token"
                    error={errors.token?.message}
                    data={DEMO_TOKENS}
                  />
                )}
              />
              <Controller
                name="username"
                control={methods.control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    error={errors.username?.message}
                    label="Username"
                  />
                )}
              />
              <Controller
                name="apiKey"
                control={methods.control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    error={errors.apiKey?.message}
                    label="API key"
                  />
                )}
              />
            </Flex>
            <Button
              type="submit"
              variant="filled"
              color="brand.0"
              fullWidth
              leftIcon={<CheckIcon color="white" width="24px" height="24px" />}
              mt={12}
            >
              Save
            </Button>
          </Flex>
        </form>
      </FormProvider>
    </Modal>
  );
};
