import React, { useCallback } from 'react';
import cx from 'classnames';
import { EditorGroup } from '../types';
import useEditorGroupsStore from 'pages/editor/editorStore';

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
    <h2 className={cx('inline-block grow shrink w-0 mr-2')}>
      <input
        className={cx(
          `w-full max-w-full bg-transparent transition-colors outline-none active:outline-none focus:shadow-[0_4px_theme("colors.sky.500")]`,
          'focus-ignore-default',
          enabled ? 'hover:text-sky-600' : 'text-gray-400 hover:text-gray-600'
        )}
        type="text"
        defaultValue={name}
        maxLength={MAX_LEN}
        onBlur={onBlur}
        aria-label="Group name"
      />
    </h2>
  );
};
