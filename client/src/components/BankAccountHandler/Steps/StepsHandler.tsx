const StepsHandler = (props: any) => {
  var indents = [];
  for (var i = 0; i < props.amount; i++) {
    const currentNumber = i+1;
    const actualNumber = i+2;
    indents.push(
      <div
        className={`stepHandler ${+currentNumber === +props.currentStep ? 'active' : ''}`}
        onClick={() => {
          props.goToStep(actualNumber);
        }}
        key={i}
        title={'Go to step ' + currentNumber}
      />
    );
  }
  return <div className="stepHandlerWrapper">{indents}</div>;
};

export default StepsHandler;
