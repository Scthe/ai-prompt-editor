import { Card } from 'components';
import React, { useEffect } from 'react';
import { Button, ButtonMode } from 'components/button';
import { motion, useAnimate } from 'framer-motion';
import { FAST_CUBIC } from 'animation';

export type ModalController =
  | { showModal: () => void; closeModal: () => void }
  | undefined;

type CancelButton = ['cancel', onClick: () => void];

export type DialogButton =
  | CancelButton
  | {
      text: string;
      mode?: ButtonMode;
      onClick: () => void;
    };
const isCancelButton = (btn: DialogButton): btn is CancelButton =>
  Array.isArray(btn) && btn[0] === 'cancel';

const MODAL_ANIMATION_Y = 20;

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
  const [dialogRef, animate] = useAnimate<HTMLDialogElement>();

  useEffect(() => {
    controllerRef.current = {
      showModal: async () => {
        await dialogRef.current?.showModal();
        animate(dialogRef.current, { opacity: 1, y: 0 }, FAST_CUBIC);
      },
      closeModal: async () => {
        await animate(
          dialogRef.current,
          { opacity: 0, y: MODAL_ANIMATION_Y },
          FAST_CUBIC
        );
        dialogRef.current?.close();
      },
    };
    if (openAtStartForDebug) {
      controllerRef.current.showModal(); // For designing
    }
  }, [animate, controllerRef, dialogRef, openAtStartForDebug]);

  return (
    <motion.dialog
      ref={dialogRef}
      className="bg-transparent-10"
      initial={{
        opacity: 0,
        y: MODAL_ANIMATION_Y,
      }}
    >
      <Card className="text-gray-800">
        {children}

        <DialogButtonsRow buttons={buttons} />
      </Card>
    </motion.dialog>
  );
};

const DialogButtonsRow = ({ buttons }: { buttons?: DialogButton[] }) => {
  if (buttons === undefined || buttons.length === 0) {
    return;
  }

  return (
    <div className="flex justify-end gap-8 px-10 py-8">
      {buttons.map((btn, idx) => (
        <DialogButton key={idx} btn={btn} />
      ))}
    </div>
  );
};

const DialogButton = ({ btn }: { btn: DialogButton }) => {
  if (isCancelButton(btn)) {
    return (
      <Button
        mode="normal"
        size="medium"
        onClick={(e) => {
          e.preventDefault();
          btn[1]();
        }}
      >
        Cancel
      </Button>
    );
  }

  return (
    <Button
      mode={btn.mode}
      size="medium"
      onClick={(e) => {
        e.preventDefault();
        btn.onClick();
      }}
    >
      {btn.text}
    </Button>
  );
};
