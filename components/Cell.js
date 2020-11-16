const e = React.createElement;

export const Cell = (props) => {
  return e("div", {
    className: "cell",
    id: props.index,
    style: { backgroundColor: props.color },
    onClick: (event) =>
      props.handleClick(event, {
        index: props.index,
        color: props.color,
      }),
  });
};
