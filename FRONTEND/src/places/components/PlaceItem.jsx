import React,{useState,useContext} from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Modal from "../../shared/components/UIElements/Modal";
import MapComponent from "../../shared/components/UIElements/MapComponents";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import './PlaceItem.css';
import { Link } from 'react-router-dom';

const PlaceItem=props=>{
  const {isLoading,error,sendRequest,clearError} =useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () =>setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () =>{
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => { 
    setShowConfirmModal(false);
  };

 const confirmDeleteHandler = async () => {
  setShowConfirmModal(false);
  try{
    await sendRequest(`${import.meta.env.VITE_BACKEND_URL}/places/${props.id}`, 'DELETE', null, {
      Authorization: 'Bearer ' + auth.token
    }) ;
    props.onDelete(props.id);
  }catch(err){
    console.error('Error deleting place:', err);
  }
      
 };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      <Modal 
      show={showMap} 
      onCancel={closeMapHandler} 
      header={props.address} 
      contentClass="place-item__modal-content"
      footerClass="place-item__modal-actions"
      footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <MapComponent coords={props.coordinates} name={props.title}/>
        </div>
      </Modal>
      <Modal 
      show={showConfirmModal}
      onCancel={cancelDeleteHandler}
      header="Are you sure?" 
      footerClass="place-item__modal-actions" 
      footer={
        <React.Fragment>
          <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
          <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
        </React.Fragment>
      }>
        <p>Do you want to proceed and delete this place?please note that it can't be undone thereafter</p>
      </Modal>
  <li className="place-item">
    <Card className="place-item__content">
      {isLoading && <LoadingSpinner asOverlay/>}
    <div className="place-item__image">
        {/** Use Cloudinary URL directly, fallback to default SVG if missing */}
        <img 
          src={props.image && props.image.startsWith('http') ? props.image : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTQ0IDg4LjU0NCA4MSA5OSA4MUMxMDkuNDU2IDgxIDExOCA4OS41NDQgMTE4IDEwMEMxMTggMTEwLjQ1NiAxMDkuNDU2IDExOSA5OSAxMTlDOC41NDQgMTE5IDgwIDExMC40NTYgODAgMTAwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNMTIwIDEwMEMxMjAgODkuNTQ0IDEyOC41NDQgODEgMTM5IDgxQzE0OS40NTYgODEgMTU4IDg5LjU0NCAxNTggMTAwQzE1OCAxMTAuNDU2IDE0OS40NTYgMTE5IDEzOSAxMTlDMTI4LjU0NCAxMTkgMTIwIDExMC40NTYgMTIwIDEwMFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZD0iTTE2MCAxMDBDMTYwIDg5LjU0NCAxNjguNTQ0IDgxIDE3OSA4MUMxODkuNDU2IDgxIDE5OCA4OS41NDQgMTk4IDEwMEMxOTggMTEwLjQ1NiAxODkuNDU2IDExOSAxNzkgMTE5QzE2OC41NDQgMTE5IDE2MCAxMTAuNDU2IDE2MCAxMDBaIiBmaWxsPSIjQ0NDQ0NDIiLz4KPC9zdmc+'}
          alt={props.title}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTQ0IDg4LjU0NCA4MSA5OSA4MUMxMDkuNDU2IDgxIDExOCA4OS41NDQgMTE4IDEwMEMxMTggMTEwLjQ1NiAxMDkuNDU2IDExOSA5OSAxMTlDOC41NDQgMTE5IDgwIDExMC40NTYgODAgMTAwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNMTIwIDEwMEMxMjAgODkuNTQ0IDEyOC41NDQgODEgMTM5IDgxQzE0OS40NTYgODEgMTU4IDg5LjU0NCAxNTggMTAwQzE1OCAxMTAuNDU2IDE0OS40NTYgMTE5IDEzOSAxMTlDMTI4LjU0NCAxMTkgMTIwIDExMC40NTYgMTIwIDEwMFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZD0iTTE2MCAxMDBDMTYwIDg5LjU0NCAxNjguNTQ0IDgxIDE3OSA4MUMxODkuNDU2IDgxIDE5OCA4OS41NDQgMTk4IDEwMEMxOTggMTEwLjQ1NiAxODkuNDU2IDExOSAxNzkgMTE5QzE2OC41NDQgMTE5IDE2MCAxMTAuNDU2IDE2MCAxMDBaIiBmaWxsPSIjQ0NDQ0NDIiLz4KPC9zdmc+';
            e.target.alt = 'Image not available';
          }}
        />
    </div>
    <div className="place-item__info">
        <h2>{props.title}</h2>
        <h3>{props.address}</h3>
        <p>{props.description}</p>
    </div>
    <div className="place-item__actions">
      <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
      {auth.userId===props.creatorId &&
      <Link to={`/places/${props.id}`}>
  <button>Edit</button>
</Link>}
      {auth.userId===props.creatorId && <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>}
    </div>
    </Card>
  </li>
  </React.Fragment>
  );
};

export default PlaceItem;
