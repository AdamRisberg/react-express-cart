import React from "react";
import api from "../api";
import { handleAdminRequestErrorFull } from "../utils";

function useCheckboxControls(deleteUrl, flashErrorMessage) {
  const [selected, setSelected] = React.useState({});
  const [allSelected, setAllSelected] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

  const containerRef = React.useRef();
  const cancelDeleteRequest = React.useRef();

  React.useEffect(() => {
    return () => {
      // eslint-disable-next-line
      cancelDeleteRequest.current && cancelDeleteRequest.current.cancel();
    };
  }, []);

  const handleSelect = React.useCallback(e => {
    const id = e.target.dataset.id;
    const checked = e.target.checked;

    setSelected(prevSelected => ({ ...prevSelected, [id]: checked }));
  }, []);

  const handleSelectAll = React.useCallback(e => {
    const allSelected = e.target.checked;
    const checkboxes = containerRef.current.querySelectorAll(
      "input[type='checkbox']"
    );
    const selected = {};

    checkboxes.forEach(box => {
      const id = box.dataset.id;
      if (id && id !== "ALL") {
        selected[id] = allSelected;
      }
    });

    setSelected(selected);
    setAllSelected(allSelected);
  }, []);

  const handleDelete = React.useCallback(() => {
    cancelDeleteRequest.current = api.getCancelTokenSource();
    const newSelected = Object.keys(selected).filter(key => selected[key]);

    api
      .post(
        deleteUrl,
        newSelected,
        { cancelToken: cancelDeleteRequest.current.token },
        true,
        true
      )
      .then(() => {
        setSelected({});
        setAllSelected(false);
        setRefresh(prev => !prev);
      })
      .catch(handleAdminRequestErrorFull(flashErrorMessage));
  }, [deleteUrl, flashErrorMessage, selected]);

  return {
    selected,
    allSelected,
    refresh,
    handleSelect,
    handleSelectAll,
    handleDelete,
    containerRef
  };
}

export default useCheckboxControls;
