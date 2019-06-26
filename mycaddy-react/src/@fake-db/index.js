import mock from './mock';
import './db/todo-db';
import './db/club-db';

mock.onAny().passThrough();
