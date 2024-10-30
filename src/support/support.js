import * as React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TextField } from '@material-ui/core';
import { useSnackbar } from 'context/snackbar-context';
import { useFirebase } from 'context/firebase-context';
import { useTranslation } from 'translations';
import { useAuth } from 'context/auth-context';
import {
  Form,
  FormBody,
  FormButton,
  FormErrorText,
  FormHeader,
  FormPrimaryText,
} from 'components/form'; // Importing form components

// Define your form schema or constraints if needed
const supportSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

function SupportScreen() {
  const { firestore } = useFirebase();
  const { control, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(supportSchema),
  });

  const { openSnackbar } = useSnackbar();
  const { user } = useAuth(); 
  const t = useTranslation();

  const onSubmit = async (data) => {
    const { title, description, email } = data;

    try {
      // Add support data to Firestore collection 'support'
      await firestore.collection('support').add({
        title,
        description,
        email,
        userDisplayName: user.displayName,
        timestamp: new Date(),
      });

      // Display success message
      openSnackbar('success', t('supportSubmitted'));

      // Reset the form
      reset();
    } catch (error) {
      // Display error message if operation fails
      openSnackbar('error', error.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader>
        <FormPrimaryText>{t('supportForm')}</FormPrimaryText>
        <FormErrorText>{errors?.title?.message || errors?.description?.message || errors?.email?.message || ' '}</FormErrorText>
      </FormHeader>

      <FormBody>
        <TextField
          inputRef={control.register}
          name="title"
          label={t('supportTitleLabel')}
          error={!!errors?.title}
          variant="outlined"
          fullWidth
        />

        <TextField
          inputRef={control.register}
          name="description"
          label={t('supportDescriptionLabel')}
          error={!!errors?.description}
          variant="outlined"
          fullWidth
          multiline
          rows={4}
        />

        <TextField
          inputRef={control.register}
          name="email"
          label={t('emailAddress')}
          error={!!errors?.email}
          variant="outlined"
          fullWidth
        />

        <FormButton type="submit">{t('submit')}</FormButton>
      </FormBody>
    </Form>
  );
}

export { SupportScreen };
