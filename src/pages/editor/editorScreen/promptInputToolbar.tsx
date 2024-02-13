import {
  CardToolbar,
  SR_IGNORE_SVG,
  IconButton,
  CopyToClipboardBtn,
  DragHandle,
  DragHandleProps,
} from 'components';
import React, { useCallback } from 'react';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import styles from './promptInputToolbar.module.css';
import { EditorGroup } from '../types';
import useEditorGroupsStore from 'pages/editor/editorStore';
import { DeleteConfirmModal, useDeleteGroupModal } from './deleteConfirmModal';
import { Toggle } from 'components/toggle';
import { GroupNameInput } from './groupNameInput';
import { PromptTextRef } from 'components/promptInput';
import { AnimatePresence } from 'framer-motion';

export const PromptInputToolbar = ({
  group,
  promptTextRef,
  dragHandleProps,
}: {
  group: EditorGroup;
  promptTextRef: PromptTextRef;
  dragHandleProps: DragHandleProps;
}) => {
  const { id: groupId, name } = group;

  const deleteGroupModal = useDeleteGroupModal(groupId);

  const setGroupEnabled = useEditorGroupsStore((s) => s.setGroupEnabled);
  const toggleGroup = useCallback(
    (enabled: boolean) => setGroupEnabled(groupId, enabled),
    [groupId, setGroupEnabled]
  );

  return (
    <CardToolbar childrenPos="apart">
      {/* left side */}
      <div className="flex grow">
        <DragHandle
          {...dragHandleProps}
          className="-translate-x-1 translate-y-[1px]"
        />
        <GroupNameInput group={group} />
      </div>

      {/* right side */}
      <div className="flex gap-x-4">
        <Toggle
          checked={group.enabled}
          id={`group-${groupId}-enabled`}
          onChecked={toggleGroup}
          srLabel="Toggle group on/off"
        />

        {/* copy btn */}
        <CopyToClipboardBtn
          id={groupId}
          textRef={promptTextRef}
          className={styles.toolbarIcon}
        />

        {/* delete btn */}
        <IconButton
          id={`delete-btn-${groupId}`}
          srLabel="Delete prompt group"
          onClick={deleteGroupModal.showDeleteModal}
        >
          <Icon
            path={mdiClose}
            size={1}
            className={`${styles.toolbarIcon} hover:text-red-500 cursor-pointer`}
            {...SR_IGNORE_SVG}
          />
        </IconButton>
      </div>

      {/* AnimatePresence required if we have some other AnimatePresence parent */}
      <AnimatePresence>
        <DeleteConfirmModal
          controllerRef={deleteGroupModal.modalCtrlRef}
          groupName={name}
          onCancel={deleteGroupModal.onCancel}
          onConfirm={deleteGroupModal.onDeleteGroup}
        />
      </AnimatePresence>
    </CardToolbar>
  );
};
