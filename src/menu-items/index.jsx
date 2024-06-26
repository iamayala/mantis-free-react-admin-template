// project import
import dashboard from './dashboard';
import part from './inventory';
import aircraft from './aircraft';
import task from './task';
import report from './report';
import document from './document';
import certification from './certification';
import profile from './profile';
import users from './users';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [
    dashboard,
    task,
    aircraft,
    part,
    users,
    document,
    // certification,
    report
    // profile
  ]
};

export default menuItems;
