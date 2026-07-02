import { Container, Nav, Navbar } from "react-bootstrap";
import {
  PlusCircle,
  Grid,
  BoxArrowInRight,
  BoxArrowRight,
} from "react-bootstrap-icons";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import LogoSVG from "./LogoSVG";

const NavBar = (): JSX.Element => {
  const { data: session } = useSession();

  return (
    <Navbar className="navbar" variant="light" expand="lg" collapseOnSelect>
      <Container className="navbar-container">
        <Navbar.Brand href="/" className="navbar-brand">
          <LogoSVG className="navbar-logo" />
          <span className="navbar-logo-text">Slotline</span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="navbar-hamburger"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {session ? (
              <>
                <Link href="/">
                  <a className="navbar-link">
                    <PlusCircle className="navbar-link-icon" /> New poll
                  </a>
                </Link>
                <Link href="/recent-polls">
                  <a className="navbar-link">
                    <Grid className="navbar-link-icon" /> My polls
                  </a>
                </Link>
                <button
                  type="button"
                  className="navbar-link"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <BoxArrowRight className="navbar-link-icon" /> Sign out
                </button>
              </>
            ) : (
              <Link href="/login">
                <a className="navbar-link">
                  <BoxArrowInRight className="navbar-link-icon" /> Sign in
                </a>
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
