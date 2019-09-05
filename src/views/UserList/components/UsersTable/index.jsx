import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import axios from 'axios';
import { apiUrl } from "../../../../config";


// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';

// Shared helpers
import { getInitials } from 'helpers';

// Shared components
import { Portlet, PortletContent } from 'components';

// Component styles
import styles from './styles';

class UsersTable extends Component {
  state = {
    selectedUsers: [],
    rowsPerPage: 10,
    limit: 10,
    page: 0,
  };

  handleSelectAll = event => {
    const { users, onSelect } = this.props;

    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = users.map(user => user.id);
    } else {
      selectedUsers = [];
    }

    this.setState({ selectedUsers });

    onSelect(selectedUsers);
  };

  handleSelectOne = (event, id) => {
    const { onSelect } = this.props;
    const { selectedUsers } = this.state;

    const selectedIndex = selectedUsers.indexOf(id);
    let newSelectedUsers = [];

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    this.setState({ selectedUsers: newSelectedUsers });

    onSelect(newSelectedUsers);
  };

  handleChangePage = (event, page) => {
    let limit = this.state.limit;
    if (event.currentTarget.getAttribute('aria-label') === 'Next Page') {
      if (limit + 10 < this.props.users.length) {
        limit += 10;
      } else {
        limit = this.props.users.length;
      }
      this.setState({ page: this.state.page + 1, limit });
    } else {
      if (limit - 10 > 10) {
        limit -= 10;
      } else {
        limit = 10;
      }
      this.setState({ page: this.state.page - 1, limit });
    }
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, limit: event.target.value });
  };
  toggleUser(user) {
    this.setState({ isLoading: true })
    axios.post(`${apiUrl}api/user/update`, { userId: user._id, isApproved: !user.isApproved }).then(res => {
      this.setState({ isLoading: false })
      window.location.href = window.location.href
    })
  }

  render() {
    const { classes, className, users } = this.props;
    const { activeTab, selectedUsers, rowsPerPage, page, limit } = this.state;
    let limitValue = [];
    let val = (users.length - (users.length % 5)) / 5;
    for (let i = 1; i <= val; i++) {
      limitValue.push(5 * i);
    }
    if (!limitValue.find((val) => { return val === users.length })) {
      limitValue.push(users.length)
    }
    console.log(limitValue);
    const rootClassName = classNames(classes.root, className);
    return (
      <Portlet className={rootClassName}>
        <PortletContent noPadding>
          <PerfectScrollbar>
            <Table>
              <TableHead>
                <TableRow>
                  {/*<TableCell align="left">
                    <Checkbox
                      checked={selectedUsers.length === users.length}
                      color="primary"
                      indeterminate={
                        selectedUsers.length > 0 &&
                        selectedUsers.length < users.length
                      }
                      onChange={this.handleSelectAll}
                    />
                    Name
                  </TableCell>*/}
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Mobile</TableCell>
                  <TableCell align="left">Registration date</TableCell>
                  <TableCell align="left">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .filter(user => {
                    if (activeTab === 1) {
                      return !user.returning;
                    }

                    if (activeTab === 2) {
                      return user.returning;
                    }

                    return user;
                  })
                  .slice(0, limit)
                  .map(user => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={user.id}
                      selected={selectedUsers.indexOf(user.id) !== -1}
                    >
                      {/*<TableCell className={classes.tableCell}>
                        <div className={classes.tableCellInner}>
                          <Checkbox
                            checked={selectedUsers.indexOf(user.id) !== -1}
                            color="primary"
                            onChange={event =>
                              this.handleSelectOne(event, user.id)
                            }
                            value="true"
                          />
                          <Avatar
                            className={classes.avatar}
                            src={user.avatarUrl}
                          >
                            {getInitials(user.name)}
                          </Avatar>
                          <Link to="#">
                            <Typography
                              className={classes.nameText}
                              variant="body1"
                            >
                              {user.name}
                            </Typography>
                          </Link>
                        </div>
                      </TableCell>*/}
                      <TableCell className={classes.tableCell}>
                        {user.name}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {user.mobileno}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {moment(user.createdAt).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {user.isApproved ?
                          <Button color="danger" onClick={() => this.toggleUser(user)}>Reject</Button> :
                          <Button color="primary" onClick={() => this.toggleUser(user)}>Approve</Button>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </PerfectScrollbar>
          <TablePagination
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            component="div"
            count={users.length}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={limitValue}
          />
        </PortletContent>
      </Portlet>
    );
  }
}

UsersTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  onShowDetails: PropTypes.func,
  users: PropTypes.array.isRequired
};

UsersTable.defaultProps = {
  users: [],
  onSelect: () => { },
  onShowDetails: () => { }
};

export default withStyles(styles)(UsersTable);
