import { Dialog, ModalController } from 'components';
import React from 'react';
import Icon from '@mdi/react';
import { mdiDelete } from '@mdi/js';

// TODO maybe remove this and just place a confirmation above prompt input?
export const DeleteConfirmModal = ({
  controllerRef,
  onConfirm,
  groupName,
}: {
  controllerRef: React.MutableRefObject<ModalController>;
  groupName: string;
  onConfirm: () => void;
}) => {
  return (
    <Dialog
      controllerRef={controllerRef}
      buttons={[
        'cancel',
        {
          onClick: onConfirm,
          text: 'Delete',
          mode: 'danger',
        },
      ]}
    >
      <div className="px-10 pt-10">
        <p className="mb-8 text-3xl text-center">
          <Icon path={mdiDelete} size={1.5} className="mx-auto mb-4" />
          Permamently delete?
        </p>

        <p className="px-10 text-gray-500">
          Do you want to delete {'"'}
          <span className="font-bold">{groupName}</span>
          {'"'}? This action is irreversible.
        </p>
      </div>
    </Dialog>
  );
};
