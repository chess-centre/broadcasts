export const RandomEmoji = (index) => {
  const Emojis = [
    <Emoji symbol="🤦‍♂️" label="blunder" />,
    <Emoji symbol="😭" label="missed win" />,
    <Emoji symbol="🤩" label="brilliancy" />,
    <Emoji symbol="🤓" label="book move" />,
    <Emoji symbol="🤯" label="complex" />,
    <Emoji symbol="🙂" label="better" />,
    <Emoji symbol="😴" label="slow" />,
  ];
  return <div className="text-center">{Emojis[index]}</div>;
};

export const Emoji = (props) => (
  <div className="text-center -mt-40">
    <span
      className="emoji text-[100px]"
      role="img"
      aria-label={props.label ? props.label : ""}
      aria-hidden={props.label ? "false" : "true"}
    >
      {props.symbol}
    </span>
    <p className="text-white text-md font-bold">{props.label}</p>
  </div>
);
