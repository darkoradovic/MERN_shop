import React from "react";
import { Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../actions/userAction";
import SearchBox from "./SearchBox";

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect >
        <Container>
          <LinkContainer to="/"> 
            <Navbar.Brand>MERN-SHOP</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Route render={({ history }) => <SearchBox history={history} />} />
           {/*  Koristimo Route jer nemamo pristup history u headeru, tj u
            searchbox komponenti */}
            <Nav className="ml-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart" /> Cart
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <>
                  <NavDropdown
                    title={userInfo.name.split(" ")[0]}
                    id="username"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="adminmenu">
                      <LinkContainer to="/admin/userlist">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/productlist">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orderlist">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                  <Nav.Link
                    onClick={logoutHandler}
                    className="profile-link circle pulse"
                  >
                    <i
                      className="fas fa-power-off fa-2x"
                      style={{ color: "black" }}
                    />
                  </Nav.Link>
                </>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user" /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
