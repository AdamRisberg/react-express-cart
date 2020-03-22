import React from "react";
import Modal from "../Modal/Modal";
import SideNav from "../SideNav/SideNav";

import { connect } from "react-redux";
import { showLogin, showRegister, logout } from "../../redux/user/user-actions";
import { hideSideNav } from "../../redux/ui/ui-actions";

function SideNavWithModal(props) {
  if (!props.show) return null;

  return (
    <Modal
      close={props.closeSideNav}
      modalType="left"
      buttonType="left"
      renderContent={close => (
        <SideNav
          storeName={props.storeName}
          categories={props.categories}
          loadingCategories={props.loadingCategories}
          loggedIn={props.loggedIn}
          show={props.showSideNav}
          showLogin={props.showLogin}
          showRegister={props.showRegister}
          logout={props.logout}
          closeSideNav={close}
        />
      )}
    />
  );
}

const mapStateToProps = ({ settings, categories, user, ui }) => ({
  storeName: settings.store_name,
  categories: categories.categories,
  loadingCategories: categories.loadingCategories,
  loggedIn: !!user.user,
  show: ui.showSideNav
});

const mapDispatchToProps = dispatch => ({
  showLogin: () => dispatch(showLogin()),
  showRegister: () => dispatch(showRegister()),
  logout: () => dispatch(logout()),
  closeSideNav: () => dispatch(hideSideNav())
});

export default connect(mapStateToProps, mapDispatchToProps)(SideNavWithModal);
