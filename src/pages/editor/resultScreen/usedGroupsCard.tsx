import React, { useCallback } from 'react';
import cx from 'classnames';
import useEditorGroupsStore from 'pages/editor/editorStore';
import { Card, CardContent, CardToolbar } from 'components';
import { Toggle } from 'components/toggle';
import { EditorGroup } from '../types';

// TODO format this, add status indicators
export const UsedGroupsCard = () => {
  const groups = useEditorGroupsStore((s) => s.groups);

  return (
    <Card shadowDirection="right" className="h-fit" borderTopOnMobile>
      <CardToolbar childrenPos="apart">
        <div className="grow">
          <h2>Groups</h2>
        </div>
      </CardToolbar>

      <CardContent>
        <ul role="list" className="grid ">
          {groups.map((g) => (
            <GroupRow key={g.id} group={g} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

// TODO this is a bit awkward to use
const GroupRow = ({ group }: { group: EditorGroup }) => {
  const id = group.id;
  const setGroupEnabled = useEditorGroupsStore((s) => s.setGroupEnabled);

  const toggleGroup = useCallback(
    (enabled: boolean) => setGroupEnabled(id, enabled),
    [id, setGroupEnabled]
  );

  return (
    <li className={cx('py-1 flex items-center gap-x-2 mb-2')}>
      <Toggle
        checked={group.enabled}
        id={`group-${id}-enabled`}
        onChecked={toggleGroup}
        srLabel="Toggle group on/off"
        className="inline-flex peer"
      />
      <span className="peer-hover:text-sky-700">{group.name}</span>
    </li>
  );
};
