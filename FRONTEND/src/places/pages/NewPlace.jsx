import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import './PlaceForm.css';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'; 
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      title: { value: '', isValid: false },
      description: { value: '', isValid: false },
      address: { value: '', isValid: false },
      image: { value: null, isValid: false }
    },
    false
  );

  const placeSubmitHandler = async event => {
    event.preventDefault();

    if (!auth.token) {
      console.error('❌ No token found in context');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('image', formState.inputs.image.value);

      await sendRequest(`${import.meta.env.VITE_BACKEND_URL}/places`, 'POST', formData, {
        Authorization: 'Bearer ' + auth.token
      });

      navigate('/');
    } catch (err) {
      console.error('❌ Place creation failed:', err);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input 
          id="title"
          element="input"
          type="text"
          label="Title" 
          validators={[VALIDATOR_REQUIRE()]} 
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input 
          id="description"
          element="textarea"
          label="Description" 
          validators={[VALIDATOR_MINLENGTH(5)]} 
          errorText="Please enter a valid description (at least 5 characters)."
          rows={3}
          onInput={inputHandler}
        />
        <Input 
          id="address"
          element="input"
          label="Address" 
          validators={[VALIDATOR_REQUIRE()]} 
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <ImageUpload 
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          Add Place
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
