import { MdClose } from "react-icons/md";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, title }) => {
  return (
    open && (
      <div className="modal" onClick={onClose}>
        <div className="modal-body" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>

            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <MdClose />
            </button>
          </div>

          <div>{children}</div>
        </div>
      </div>
    )
  );
};

export default Modal;
