import { Button } from "../../Component/Button/Button";
import { FiAlertTriangle } from "react-icons/fi";
import classes from "./AreYouSureModal.module.css";
import { FaTrash } from "react-icons/fa6";
import { Modal } from "react-bootstrap";

const AreYouSureModal = ({
  show,
  setShow,
  title = "Are You Sure You Want To Delete ",
  subTitle = "Once you delete this can’t be recovered",
  onClick,
  isApiCall,
}) => {
  return (
    <>
      <style>{`
        .modal-content {
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
        }
        .modal-body {
          padding: 40px 32px;
height:auto;
        }
        .modal-header {
          flex-direction: column;
          background: var(--main-color);
           border-bottom: none;

          justify-content: center !important;
          padding: 0.75rem;~
        }
        .name {
          font-size: 18px;
          color: var(--text-color-black);
        }
      `}</style>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Body>
          <div className={classes.content}>
            <div className={classes.mainDiv}>
              <div className={classes.__icon}>
                <FaTrash size={45} color="var(  --primary-color)" />
              </div>
              <p className={classes.title}>{title}</p>
              <p className={[classes.message].join(" ")}>{subTitle}</p>
            </div>
            <div className={classes.btnsBox}>
              <Button
                className={classes.yesBtn}
                onClick={onClick}
                disabled={isApiCall}
              >
                {isApiCall ? "Wait..." : "Yes"}
              </Button>
              <Button
                className={classes.noBtn}
                onClick={async () => {
                  setShow(false);
                }}
                disabled={isApiCall}
              >
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AreYouSureModal;
