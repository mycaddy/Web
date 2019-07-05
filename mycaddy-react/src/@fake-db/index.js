import mock from './mock'
import './db/todo-db'
import './db/club-db'
import './db/contacts-db'
import './db/e-commerce-db'

mock.onAny().passThrough();
