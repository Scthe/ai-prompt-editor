import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import React from 'react';
import useEditorGroupsStore from 'pages/editor/editorStore';

// TODO maybe move it to old-school 'floating action button' in bottom right corner?
export const AddNewGroupBtn = () => {
  const addNewGroup = useEditorGroupsStore((s) => s.addNewGroup);

  return (
    <button
      type="button"
      onClick={addNewGroup}
      className="text-gray-700 transition-colors border-b-4 border-transparent hover:text-gray-900 hover:border-sky-500"
    >
      <Icon
        path={mdiPlus}
        size={1}
        className="inline-block -translate-y-[3px]"
        aria-hidden="true"
      />
      <span>Add new group</span>
    </button>
  );
};
