import React from "react";

import Address from "../../../shared-components/Address/Address";
import Button from "../../Button/Button";

import styles from "./AddressCard.module.css";

const AddressCard = ({
  address,
  onBlankClick,
  showEditForm,
  setAsDefault,
  deleteAddress,
  userID,
  blank
}) => {
  return blank ? (
    <div
      className={`${styles.AddressCard} ${styles.Blank}`}
      onClick={onBlankClick}
    >
      <span>Add New Address</span>
    </div>
  ) : (
    <div
      className={`${styles.AddressCard} ${
        address.default ? styles.DarkBorder : ""
      }`}
    >
      {address.default ? <div className={styles.Default}>Default</div> : null}
      <Address address={address} showPhone />
      <Button text="Edit" onClick={showEditForm} size="Small" />
      <Button
        text="Delete"
        onClick={() => deleteAddress(userID, address._id)}
        buttonStyle="Cancel"
        size="Small"
      />
      {address.default ? null : (
        <Button text="Set as Default" onClick={setAsDefault} size="Small" />
      )}
    </div>
  );
};

export default AddressCard;
