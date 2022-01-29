const StepsHandler = (props: any) => {
  var indents = [];
  for (var i = 0; i < props.amount; i++) {
    const currentNumber = i+2;
    console.log(currentNumber);
    indents.push(
      <div
        className="stepHandler"
        onClick={() => {
          props.goToStep(currentNumber);
        }}
        key={i}
        title={'Go to step ' + currentNumber}
      />
    );
  }
  return <div className="stepHandlerWrapper">{indents}</div>;
};

export default StepsHandler;
