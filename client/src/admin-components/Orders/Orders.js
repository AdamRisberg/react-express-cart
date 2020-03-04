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

function Orders(props) {
  const {
    selected,
    allSelected,
    refresh,
    handleSelect,
    handleSelectAll,
    handleDelete,
    containerRef
  } = useCheckboxControls("/api/orders/delete", props.flashErrorMessage);

  const handleEdit = e => {
    const id = e.currentTarget.dataset.id;
    props.history.push("/admin/order/" + id);
  };

  return (
    <WithPagination
      isAdmin={true}
      flashErrorMessage={props.flashErrorMessage}
      fetchUrl="/api/orders/all?page="
      fetchUseSession
      fetchAdmin
      refresh={refresh}
      renderTitle={() => (
        <TitleBox>
          ORDERS
          <Button type="delete" onClick={handleDelete} />
        </TitleBox>
      )}
      renderItems={orders => (
        <Table ref={containerRef}>
          <Head>
            <HeadRow>
              <HeadCell>
                <Checkbox
                  id="orders-ALL"
                  handleSelect={handleSelectAll}
                  isChecked={allSelected}
                  data-id="ALL"
                />
              </HeadCell>
              <HeadCell>Order #</HeadCell>
              <HeadCell collapse="medium">Customer</HeadCell>
              <HeadCell collapse="medium">Status</HeadCell>
              <HeadCell collapse="large" align="right">
                Total
              </HeadCell>
              <HeadCell collapse="small" align="right">
                Date
              </HeadCell>
              <HeadCell />
            </HeadRow>
          </Head>
          <Body>
            {orders.map(order => (
              <Row key={order._id}>
                <Cell>
                  <Checkbox
                    id={order._id}
                    handleSelect={handleSelect}
                    isChecked={selected[order._id]}
                    data-id={order._id}
                  />
                </Cell>
                <Cell>{order.orderNumber}</Cell>
                <Cell collapse="medium">
                  {`${order.billingAddress.firstName} ${order.billingAddress.lastName}`}
                </Cell>
                <Cell collapse="medium">{order.status}</Cell>
                <Cell collapse="large" align="right">
                  ${order.total.toFixed(2)}
                </Cell>
                <Cell collapse="small" align="right">
                  {formatDateShort(order.date)}
                </Cell>
                <Cell>
                  <Button
                    type="view"
                    data-id={order._id}
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

export default Orders;
