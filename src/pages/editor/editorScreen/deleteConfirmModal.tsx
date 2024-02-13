import { Dialog, ModalController, SR_IGNORE_SVG } from 'components';
import React, { useCallback, useRef } from 'react';
import Icon from '@mdi/react';
import { mdiDelete } from '@mdi/js';
import useEditorGroupsStore from '../editorStore';
import { EditorGroupId } from '../types';

// TODO maybe remove this and just place a confirmation above prompt input?
export const DeleteConfirmModal = ({
  controllerRef,
  onConfirm,
  onCancel,
  groupName,
}: {
  controllerRef: React.MutableRefObject<ModalController>;
  groupName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <Dialog
      controllerRef={controllerRef}
      buttons={[
        ['cancel', onCancel],
        {
          onClick: onConfirm,
          text: 'Delete',
          mode: 'danger',
        },
      ]}
    >
      <div className="px-10 pt-10">
        <p className="mb-8 text-3xl text-center">
          <Icon
            path={mdiDelete}
            size={1.5}
            className="mx-auto mb-4"
            {...SR_IGNORE_SVG}
          />
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

export function useDeleteGroupModal(groupId: EditorGroupId) {
  const modalCtrlRef = useRef<ModalController>();

  const deleteGroup = useEditorGroupsStore((s) => s.removeGroup);

  const showDeleteModal = useCallback(() => {
    modalCtrlRef.current?.showModal();
  }, []);

  const onDeleteGroup = useCallback(async () => {
    await modalCtrlRef.current?.closeModal();
    deleteGroup(groupId);
  }, [deleteGroup, groupId]);

  const onCancel = useCallback(() => {
    modalCtrlRef.current?.closeModal();
  }, []);

  return { modalCtrlRef, showDeleteModal, onDeleteGroup, onCancel };
}
