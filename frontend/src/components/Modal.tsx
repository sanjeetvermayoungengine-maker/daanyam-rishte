import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export function Modal({ title, children, isOpen, onClose }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}>
            x
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
