import React, { useCallback } from 'react';
import cx from 'classnames';
import { EditorGroup } from '../types';
import useEditorGroupsStore from 'store/editorStore';

interface Props {
  group: EditorGroup;
}

const MAX_LEN = 30;

/** Impl note: uncontrolled so we do not trigger store too often */
export const GroupNameInput = ({ group }: Props) => {
  const { name, enabled, id } = group;

  const setName = useEditorGroupsStore((s) => s.setName);

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      if (newValue.length === 0) {
        newValue = `Group ${id}`;
        e.target.value = newValue;
      }
      setName(id, newValue);
    },
    [id, setName]
  );

  return (
    <h2 className={cx(!enabled && 'text-gray-400')}>
      <input
        className={cx(
          `bg-transparent outline-none focus:shadow-[0_4px_theme("colors.sky.500")]`
        )}
        type="text"
        defaultValue={name}
        maxLength={MAX_LEN}
        onBlur={onBlur}
      />
    </h2>
  );
};
