import React, { useRef } from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";

import './SideDrawer.css';

const SideDrawer = (props) => {
  const nodeRef = useRef(null); // ✅ Define nodeRef inside SideDrawer

  return createPortal(
    <CSSTransition 
      in={props.show} 
      timeout={200} 
      classNames="slide-in-left" 
      unmountOnExit 
      mountOnEnter
      nodeRef={nodeRef} // ✅ Properly pass nodeRef to CSSTransition
    >
      <aside className="side-drawer" onClick={props.onClick} ref={nodeRef}>
        {props.children}
      </aside>
    </CSSTransition>,
    document.getElementById('drawer-hook')
  );
};

export default SideDrawer;
