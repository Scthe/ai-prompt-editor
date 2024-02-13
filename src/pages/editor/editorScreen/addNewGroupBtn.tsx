import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import React from 'react';
import cx from 'classnames';
import useEditorGroupsStore from 'pages/editor/editorStore';
import { SR_IGNORE_SVG } from 'components';

// TODO maybe move it to old-school 'floating action button' in bottom right corner?
export const AddNewGroupBtn = () => {
  const addNewGroup = useEditorGroupsStore((s) => s.addNewGroup);

  return (
    <button
      type="button"
      onClick={addNewGroup}
      className="overflow-hidden text-gray-700 transition-colors hover:text-gray-900 group"
    >
      <Icon
        path={mdiPlus}
        size={1}
        className="inline-block -translate-y-[3px]"
        {...SR_IGNORE_SVG}
      />
      <span>Add new group</span>
      <div
        className={cx(
          'border-b-4 border-sky-500 transition-transform',
          '-translate-x-full group-hover:translate-x-0'
        )}
      ></div>
    </button>
  );
};
