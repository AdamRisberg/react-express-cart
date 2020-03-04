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
import { formatDateShort } from "../../utils";

function Customers(props) {
  const {
    selected,
    allSelected,
    refresh,
    handleSelect,
    handleSelectAll,
    handleDelete,
    containerRef
  } = useCheckboxControls("/api/customers/delete", props.flashErrorMessage);

  const handleEdit = e => {
    const id = e.currentTarget.dataset.id;
    props.history.push("/admin/customer/" + id);
  };

  return (
    <WithPagination
      isAdmin={true}
      flashErrorMessage={props.flashErrorMessage}
      fetchUrl="/api/customers?page="
      fetchUseSession
      fetchAdmin
      refresh={refresh}
      renderTitle={() => (
        <TitleBox>
          CUSTOMERS
          <Button type="delete" onClick={handleDelete} />
        </TitleBox>
      )}
      renderItems={customers => (
        <Table ref={containerRef}>
          <Head>
            <HeadRow>
              <HeadCell>
                <Checkbox
                  handleSelect={handleSelectAll}
                  isChecked={allSelected}
                  id="customers-ALL"
                  data-id="ALL"
                />
              </HeadCell>
              <HeadCell>Name</HeadCell>
              <HeadCell collapse="large">Email</HeadCell>
              <HeadCell collapse="small">Date Added</HeadCell>
              <HeadCell />
            </HeadRow>
          </Head>
          <Body>
            {customers.map(customer => (
              <Row key={customer._id}>
                <Cell>
                  <Checkbox
                    handleSelect={handleSelect}
                    isChecked={selected[customer._id]}
                    id={customer._id}
                    data-id={customer._id}
                  />
                </Cell>
                <Cell>
                  {customer.firstName} {customer.lastName}
                </Cell>
                <Cell collapse="large">{customer.email}</Cell>
                <Cell collapse="small">
                  {formatDateShort(customer.dateAdded)}
                </Cell>
                <Cell>
                  <Button
                    type="edit"
                    data-id={customer._id}
                    onClick={handleEdit}
                  />
                </Cell>
              </Row>
            ))}
          </Body>
        </Table>
      )}
    />
  );
}

export default Customers;
