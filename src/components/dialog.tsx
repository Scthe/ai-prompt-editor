import { Card } from 'components';
import React, { useCallback, useEffect, useRef } from 'react';
import { Button, ButtonMode } from 'components/button';

export type ModalController =
  | { showModal: () => void; closeModal: () => void }
  | undefined;

export type DialogButton =
  | 'cancel'
  | {
      text: string;
      mode?: ButtonMode;
      onClick: () => void;
    };

type Props = React.PropsWithChildren<{
  controllerRef: React.MutableRefObject<ModalController>;
  buttons?: DialogButton[];
  openAtStartForDebug?: boolean;
}>;

export const Dialog = ({
  controllerRef,
  buttons,
  openAtStartForDebug,
  children,
}: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    controllerRef.current = {
      showModal: () => dialogRef.current?.showModal(),
      closeModal: () => dialogRef.current?.close(),
    };
    if (openAtStartForDebug) {
      controllerRef.current.showModal(); // For designing
    }
  }, [controllerRef, openAtStartForDebug]);

  const handleCancel = useCallback(() => dialogRef.current?.close(), []);

  return (
    <dialog ref={dialogRef} className="bg-transparent">
      <Card className="text-gray-800">
        {children}

        <DialogButtonsRow onCancel={handleCancel} buttons={buttons} />
      </Card>
    </dialog>
  );
};

const DialogButtonsRow = ({
  buttons,
  onCancel,
}: {
  buttons?: DialogButton[];
  onCancel: () => void;
}) => {
  if (buttons === undefined || buttons.length === 0) {
    return;
  }

  return (
    <div className="flex justify-end gap-8 px-10 py-8">
      {buttons.map((btn, idx) => (
        <DialogButton key={idx} btn={btn} onCancel={onCancel} />
      ))}
    </div>
  );
};

const DialogButton = ({
  btn,
  onCancel,
}: {
  btn: DialogButton;
  onCancel: () => void;
}) => {
  if (btn === 'cancel') {
    return (
      <Button onClick={onCancel} mode="normal" size="medium">
        Cancel
      </Button>
    );
  }

  return (
    <Button onClick={btn.onClick} mode={btn.mode} size="medium">
      {btn.text}
    </Button>
  );
};
