import React, { useRef } from "react";
import ReactDOM from "react-dom";
import Backdrop from "./Backdrop";
import { CSSTransition } from "react-transition-group";
import './Modal.css';

const ModalOverlay = props => {
    const nodeRef = useRef(null); // Create a ref for CSSTransition

    const content = (
    <div ref={nodeRef} className={`modal ${props.className}`} style={props.style}>
        <header className={`modal__header ${props.headerClass}`} >
           <h2>{props.header}</h2>
        </header>
        <form onSubmit={props.onSubmit ? props.onSubmit : event => event.preventDefault()}>
           <div className={`modal__content ${props.contentClass}`}>
              {props.children}
           </div>
           <footer className={`modal__footer ${props.footerClass}`}>
              {props.footer}
            </footer>
        </form>
    </div>
    );
   return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

const Modal = props => {
  const nodeRef = useRef(null); // Create a ref for CSSTransition

  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        nodeRef={nodeRef} // Pass ref to CSSTransition
        in={props.show}
        mountOnEnter 
        unmountOnExit 
        timeout={200} 
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
