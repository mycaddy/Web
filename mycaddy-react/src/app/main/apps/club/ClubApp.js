import React, { useEffect, useRef, useState, createRef } from 'react'
import { useDispatch } from 'react-redux'
import withReducer from 'app/store/withReducer'
import reducer from './store/reducers';
import * as Actions from './store/actions';
import { FusePageCarded } from '@fuse'

import ClubList from './ClubList'
import ClubToolbar from './ClubToolbar'
import ClubHeader from './ClubHeader'
import ClubSidebarHeader from './ClubSidebarHeader'
import ClubSidebarContent from './ClubSidebarContent'

import ContactsList from './ContactsList'

function ClubApp(props) {
  const dispatch = useDispatch()
  const pageLayout = useRef(null)
  // const [ pageLayout, setPageLayout ] = useState(() => createRef())

  useEffect(() => {
    dispatch(Actions.getFilters())
    dispatch(Actions.getFolders())
    dispatch(Actions.getLabels())

    dispatch(Actions.getContacts(props.match.params))
    dispatch(Actions.getUserData())

  }, [dispatch])

  useEffect(() => {
    dispatch(Actions.getClubs(props.match.params))
    dispatch(Actions.getContacts(props.match.params))
  }, [dispatch, props.match.params])

  return (
    <>
      <FusePageCarded 
        classes={{
          root: "w-full",
          header: "items-center min-h-72 h-72 sm:h-136 sm:min-h-136"
        }}
        header={<ClubHeader pageLayout={pageLayout} />}
        contentToolbar={<ClubToolbar />}
        content={<ContactsList />}
        leftSidebarHeader={<ClubSidebarHeader />}
        leftSidebarContent={<ClubSidebarContent />}
        ref={pageLayout}
        innerScroll
      />
    </>
  )
}

export default withReducer('clubApp', reducer)(ClubApp)