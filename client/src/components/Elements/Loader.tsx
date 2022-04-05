import { Fragment } from 'react';
import ReactDOM from 'react-dom';

import classes from './Loader.module.css';

// Import modules

const Backdrop = (props: any) => {
  return <div className={classes.backdrop} onClick={props.onClose} />;
};

const ModalOverlay = (props: any) => {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById('overlays')!;

const Loader = (props: any) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onClose} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay>
          <div className={classes.loaderWrapper}>
            <div className={classes.preloader}>
              <div className={classes.loader} />
            </div>
          </div>
        </ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default Loader;
