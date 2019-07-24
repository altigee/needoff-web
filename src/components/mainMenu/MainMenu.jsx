import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { Button, Badge, Menu, Layout, Icon } from 'antd';
import { Route, Redirect, Switch, Link } from 'react-router-dom';
import MAIN_ROUTES from './main.routes';
import history from './../router/history';
import authService from './../../services/authService/authService';
import profileService from './../../services/profileService/profileService';
import Loading from './../loading/Loading';
import WorkspacesList from './../workspaces/WorkspacesList';
import Workspace from './../workspace/Workspace';
import Calendar from './../calendar/Calendar';
import Profile from './../profile/Profile';
import Leaves from './../leaves/Leaves';
import Todo from './../todo/Todo';
import sendNotification from './../notifications/notifications';

import './styles.scss';
import 'antd/dist/antd.css';

const { Content, Sider } = Layout;

const MainMenu = () => {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(null);
  const [currentWsId, setCurrentWsId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [workspaces, currentUser] = await Promise.all([
          profileService.fetchMyWorkspaces(),
          profileService.getUserInfo()
        ]);
        setCurrentUser(currentUser);
        if (get(workspaces, 'length')) {
          const lsCurrentWs = localStorage.getItem('currentWs');
          if (lsCurrentWs) {
            setCurrentWsId(profileService.currentWs.id);
            history.push(MAIN_ROUTES.WORKSPACE);
          }
          if (workspaces.length === 1) {
            localStorage.setItem('currentWs', workspaces[0].name);
            setCurrentWsId(profileService.currentWs.id);
            history.push(MAIN_ROUTES.WORKSPACE);
          }
        } else {
          history.push(MAIN_ROUTES.WORKSPACES);
        }
      } catch (error) {
        sendNotification('error');
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (currentWsId && currentUser) {
        await profileService.getWsOwner(currentWsId);
        if (profileService.isAdmin) {
          try {
            const approvalDaysOff = await profileService.getDaysOffForApproval(
              currentWsId
            );
            setCount(approvalDaysOff.dayOffsForApproval.length);
          } catch (error) {
            sendNotification('error');
          }
        }
      }
    })();
  }, [currentUser, currentWsId]);

  const setWsId = wsId => setCurrentWsId(wsId);
  const setCountRequests = count => setCount(count);

  if (loading) return <Loading />;
  const currentWs = localStorage.getItem('currentWs');
  return (
    <div className="nd-main-wrapper">
      <Layout>
        <Sider theme="light" style={{ position: 'fixed' }}>
          <Menu
            className="nd-main-menu-sider"
            defaultSelectedKeys={['']}
            mode="inline"
            defaultOpenKeys={['sub1']}
          >
            {currentWs && (
              <Menu.Item key="1">
                <Icon type="team" />
                <span className="nd-main-menu-sider-item">
                  <Link to={MAIN_ROUTES.WORKSPACE}>{currentWs}</Link>
                </span>
              </Menu.Item>
            )}
            <Menu.Item key="2">
              <Icon type="pie-chart" />
              <span className="nd-main-menu-sider-item">
                <Link to={MAIN_ROUTES.PROFILE}>Profile</Link>
              </span>
            </Menu.Item>
            <Menu.Item key="3" disabled={!currentWsId}>
              <Icon type="desktop" />
              <span className="nd-main-menu-sider-item">
                <Link disabled={!currentWsId} to={MAIN_ROUTES.LEAVES}>
                  Leaves
                </Link>
              </span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="team" />
              <span className="nd-main-menu-sider-item">
                <Link to={MAIN_ROUTES.WORKSPACES}>Workspaces</Link>
              </span>
            </Menu.Item>
            <Menu.Item key="5" disabled={!currentWsId}>
              <Icon type="desktop" />
              <span className="nd-main-menu-sider-item">
                <Link disabled={!currentWsId} to={MAIN_ROUTES.CALENDAR}>
                  Team Calendar
                </Link>
              </span>
            </Menu.Item>
            <Menu.Item key="6" disabled={!currentWsId}>
              {profileService.isAdmin && (
                <Badge count={count}>
                  <Icon type="file" />
                  <span className="nd-main-menu-sider-item">
                    <Link disabled={!currentWsId} to={MAIN_ROUTES.TODO}>
                      Todo
                    </Link>
                  </span>
                </Badge>
              )}
            </Menu.Item>
            <Menu.Item className="logout" key="7">
              <Icon type="desktop" />
              <span className="nd-main-menu-sider-item">
                <Button
                  className="nd-main-menu-sider-item-btn"
                  type="link"
                  onClick={() => authService.logout()}
                >
                  Log out
                </Button>
              </span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className="nd-main-menu-content" style={{ marginLeft: 200 }}>
          <Switch>
            <Route
              path={MAIN_ROUTES.WORKSPACES}
              render={props => <WorkspacesList setWsId={setWsId} {...props} />}
            />
            <Route path={MAIN_ROUTES.CALENDAR} component={Calendar} />
            <Route path={MAIN_ROUTES.PROFILE} component={Profile} />
            <Route path={MAIN_ROUTES.LEAVES} component={Leaves} />
            <Route path={MAIN_ROUTES.WORKSPACE} component={Workspace} />
            <Route
              path={MAIN_ROUTES.TODO}
              render={props => <Todo setCount={setCountRequests} {...props} />}
            />
            <Redirect to={MAIN_ROUTES.WORKSPACES} />
          </Switch>
        </Content>
      </Layout>
    </div>
  );
};

export default MainMenu;
