import React, { useState } from 'react';
import { Icon, MenuItem, TextField } from '@material-ui/core';
import { FuseAnimate } from '@fuse';

function ClubSidebarHeader() {
  const [selectedAccount, setSelectedCount] = useState('creapond');

  function handleAccountChange(ev) {
    setSelectedCount(ev.target.value);
  }

  return (
    <div className="flex flex-col justify-center h-full p-24">

      <div className="flex items-center flex-1">
        <FuseAnimate animation="transition.expandIn" delay={300}>
          <Icon className="text-32 mr-16">flag</Icon>
        </FuseAnimate>
        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
          <span className="text-24">Club</span>
        </FuseAnimate>
      </div>

    </div>
  );
}

export default ClubSidebarHeader;
