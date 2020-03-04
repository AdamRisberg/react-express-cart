import React from "react";
import api from "../../api";
import { handleAdminRequestErrorFull } from "../../utils";

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

import styles from "./Shipping.module.css";

function Shipping(props) {
  const {
    selected,
    allSelected,
    refresh,
    handleSelect,
    handleSelectAll,
    handleDelete,
    containerRef
  } = useCheckboxControls("/api/shipping/delete", props.flashErrorMessage);

  const cancelPostRequest = React.useRef();
  React.useEffect(() => {
    return () => {
      // eslint-disable-next-line
      cancelPostRequest.current && cancelPostRequest.current.cancel();
    };
  });

  const handleAdd = () => {
    cancelPostRequest.current = api.getCancelTokenSource();

    api
      .post(
        "/api/shipping/",
        {},
        { cancelToken: cancelPostRequest.current.token },
        true,
        true
      )
      .then(res => {
        props.history.push("/admin/shipping/" + res.data);
      })
      .catch(handleAdminRequestErrorFull(props.flashErrorMessage));
  };

  const handleEdit = e => {
    const id = e.currentTarget.dataset.id;
    props.history.push("/admin/shipping/" + id);
  };

  return (
    <WithPagination
      isAdmin={true}
      flashErrorMessage={props.flashErrorMessage}
      fetchUrl="/api/shipping?page="
      fetchUseSession
      fetchAdmin
      refresh={refresh}
      renderTitle={() => (
        <TitleBox>
          SHIPPING
          <Button type="add" onClick={handleAdd} />
          <Button type="delete" onClick={handleDelete} />
        </TitleBox>
      )}
      renderItems={shipping => (
        <Table ref={containerRef} className={styles.Table}>
          <Head>
            <HeadRow>
              <HeadCell>
                <Checkbox
                  handleSelect={handleSelectAll}
                  isChecked={allSelected}
                  id="shipping-ALL"
                  data-id="ALL"
                />
              </HeadCell>
              <HeadCell>Name</HeadCell>
              <HeadCell collapse="large">Label</HeadCell>
              <HeadCell collapse="small">Price</HeadCell>
              <HeadCell collapse="medium">Active</HeadCell>
              <HeadCell />
            </HeadRow>
          </Head>
          <Body>
            {shipping.map(method => {
              return (
                <Row key={method._id}>
                  <Cell>
                    <Checkbox
                      handleSelect={handleSelect}
                      isChecked={selected[method._id]}
                      id={method._id}
                      data-id={method._id}
                    />
                  </Cell>
                  <Cell>{method.name}</Cell>
                  <Cell collapse="large">{method.label}</Cell>
                  <Cell collapse="small">${method.price.toFixed(2)}</Cell>
                  <Cell collapse="medium">{method.active ? "Yes" : "No"}</Cell>
                  <Cell>
                    <Button
                      type="edit"
                      data-id={method._id}
                      onClick={handleEdit}
                    />
                  </Cell>
                </Row>
              );
            })}
            {!shipping.length ? (
              <Row>
                <Cell colSpan={6}>No shipping methods found.</Cell>
              </Row>
            ) : null}
          </Body>
        </Table>
      )}
    />
  );
}

export default Shipping;
