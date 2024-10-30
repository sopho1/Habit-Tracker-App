import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, MenuItem } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from 'context/firebase-context';
import { useAuth } from 'context/auth-context';
import {
  Form,
  FormBody,
  FormButton,
  FormErrorText,
  FormHeader,
  FormPrimaryText,
} from 'components/form';
import { useTranslation } from 'translations';

const NewPost = () => {
  const { user } = useAuth();
  const t = useTranslation();
  const history = useNavigate();
  const { firestore } = useFirebase();
  const { register, handleSubmit, errors } = useForm();
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = firestore.collection('categories');
        const snapshot = await categoriesRef.get();
        const categories = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategoriesList(categories);
      } catch (error) {
        console.error(t('errorFetchingCategories'), error);
      }
    };

    fetchCategories();
  }, [firestore, t]);

  const onSubmit = async (data) => {
    const { title, author, content } = data;

    try {
      await firestore.collection('posts').add({
        title,
        content,
        author,
        category: selectedCategory,
        userId: user.uid,
        timestamp: new Date(),
        likesCount: 0,
        likedBy: []
      });

      // await firestore.collection('notifications').add({
      //   title: title,
      //   timestamp: new Date(),
      // });

      history('/forum');
    } catch (error) {
      console.error(t('errorCreatingPost'), error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader>
        <FormPrimaryText>{t('createNewPost')}</FormPrimaryText>
      </FormHeader>

      <FormBody>
        <TextField
          inputRef={register({ required: t('titleRequired') })}
          name="title"
          label={t('title')}
          error={!!errors.title}
          fullWidth
        />
        {errors.title && <FormErrorText>{errors.title.message}</FormErrorText>}

        <TextField
          inputRef={register}
          name="author"
          label={t('authorName')}
          fullWidth
          defaultValue={user.displayName}
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          select
          name="category"
          label={t('category')}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          error={!!errors.category}
          fullWidth
        >
          {categoriesList.map((category) => (
            <MenuItem key={category.id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
        {errors.category && <FormErrorText>{errors.category.message}</FormErrorText>}

        <TextField
          inputRef={register({ required: t('contentRequired') })}
          name="content"
          label={t('content')}
          error={!!errors.content}
          fullWidth
          multiline
          rows={4}
        />
        {errors.content && <FormErrorText>{errors.content.message}</FormErrorText>}

        <FormButton type="submit">{t('createPost')}</FormButton>
      </FormBody>
    </Form>
  );
};

export default NewPost;
