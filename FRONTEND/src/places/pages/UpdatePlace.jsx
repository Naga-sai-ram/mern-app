import React, { useEffect, useState, useCallback,useContext } from 'react';
import { useParams,useNavigate, Navigate } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const navigate = useNavigate(); // Use useHistory to navigate after update

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: { value: '', isValid: false },
      description: { value: '', isValid: false }
    },
    false
  );

  const fetchPlace = useCallback(async () => {
    try {
      const responseData = await sendRequest(`${import.meta.env.VITE_BACKEND_URL}/places/${placeId}`);
      setLoadedPlace(responseData.place);
      
      // Ensure both fields are marked as valid when loading existing data
      setFormData(
        {
          title: { value: responseData.place.title, isValid: true },
          description: { value: responseData.place.description, isValid: true }
        },
        true
      );
    } catch (err) {
      console.error('FetchPlace error:', err.message);
    }
  }, [sendRequest, placeId, setFormData]);

  useEffect(() => {
    fetchPlace();
  }, [fetchPlace]);

  const placeUpdateSubmitHandler =async event => {
    event.preventDefault();
    try{
    await sendRequest(
      `${import.meta.env.VITE_BACKEND_URL}/places/${placeId}`,
      'PATCH',JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value
      }),
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      });
      navigate(`/`+auth.userId+'/places'); 
    } catch (err) {
      console.error('PlaceUpdateSubmitHandler error:', err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialIsValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialIsValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
