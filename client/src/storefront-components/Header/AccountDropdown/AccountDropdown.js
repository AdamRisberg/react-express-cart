import React from "react";
import { Link } from "react-router-dom";
import styles from "./AccountDropdown.module.css";

function AccountDropdown({ style, text, logout }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();

  const handleClickOutside = e => {
    if (ref.current && !ref.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const close = () => setOpen(false);

  React.useEffect(() => {
    if (open) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} style={style} className={styles.Dropdown}>
      <button
        className={styles.DropdownButton}
        onClick={() => setOpen(prev => !prev)}
      >
        {text}
        <span className={styles.DownArrowAfter} />
      </button>
      <div
        className={styles.DropdownContent}
        style={{
          display: open ? "block" : "none"
        }}
      >
        <ul>
          <DropdownItem text="Account" href="/account" close={close} />
          <DropdownItem text="Orders" href="/account/orders" close={close} />
          <DropdownItem
            text="Addresses"
            href="/account/addresses"
            close={close}
          />
          <DropdownItem
            text="Sign Out"
            href="/account/logout"
            onClick={logout}
            close={close}
          />
        </ul>
      </div>
    </div>
  );
}

function DropdownItem({ text, href, onClick, close }) {
  return (
    <li>
      <Link
        to={href}
        onClick={e => {
          close();
          onClick && onClick(e);
        }}
      >
        {text}
      </Link>
    </li>
  );
}

export default AccountDropdown;
