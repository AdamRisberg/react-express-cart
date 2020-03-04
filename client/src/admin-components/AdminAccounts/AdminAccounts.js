import React from "react";

import WithPagination from "../../shared-components/WithPagination/WithPagination";
import Checkbox from "../Checkbox/Checkbox";
import Button from "../Button/Button";
import {
  Table,
  Head,
  HeadRow,
  HeadCell,
  Body,
  Row,
  Cell,
  TitleBox
} from "../AdminTable/AdminTable";

import useCheckboxControls from "../../hooks/useCheckboxControls";

function AdminAccounts(props) {
  const {
    selected,
    allSelected,
    refresh,
    handleSelect,
    handleSelectAll,
    handleDelete,
    containerRef
  } = useCheckboxControls("/api/admin/delete", props.flashErrorMessage);

  const handleAdd = () => {
    if (!props.user.allowEdit) {
      return props.flashErrorMessage();
    }
    props.history.push("/admin/admin_account");
  };

  const handleEdit = e => {
    const id = e.currentTarget.dataset.id;
    props.history.push("/admin/admin_account/" + id);
  };

  return (
    <WithPagination
      isAdmin={true}
      flashErrorMessage={props.flashErrorMessage}
      fetchUrl="/api/admin?page="
      fetchUseSession
      fetchAdmin
      refresh={refresh}
      renderTitle={() => (
        <TitleBox>
          ADMIN ACCOUNTS
          <Button type="add" onClick={handleAdd} />
          <Button type="delete" onClick={handleDelete} />
        </TitleBox>
      )}
      renderItems={accounts => (
        <Table ref={containerRef}>
          <Head>
            <HeadRow>
              <HeadCell>
                <Checkbox
                  id="accounts-ALL"
                  handleSelect={handleSelectAll}
                  isChecked={allSelected}
                  data-id="ALL"
                />
              </HeadCell>
              <HeadCell>Name</HeadCell>
              <HeadCell collapse="large">Email</HeadCell>
              <HeadCell collapse="medium">Active</HeadCell>
              <HeadCell />
            </HeadRow>
          </Head>
          <Body>
            {accounts.map(account => (
              <Row key={account._id}>
                <Cell>
                  <Checkbox
                    handleSelect={handleSelect}
                    isChecked={selected[account._id]}
                    id={account._id}
                    data-id={account._id}
                  />
                </Cell>
                <Cell>{`${account.firstName} ${account.lastName}`}</Cell>
                <Cell collapse="large">{account.email}</Cell>
                <Cell collapse="medium">{account.active ? "Yes" : "No"}</Cell>
                <Cell>
                  <Button
                    type="edit"
                    data-id={account._id}
                    onClick={handleEdit}
                  />
                </Cell>
              </Row>
            ))}
            {!accounts.length ? (
              <Row>
                <Cell colSpan={6}>No admin accounts found.</Cell>
              </Row>
            ) : null}
          </Body>
        </Table>
      )}
    />
  );
}

export default AdminAccounts;
