import { useLink } from '../../../services';
import Input from '../../Elements/Input';
import StepsHandler from './StepsHandler';

const dummydata = [
  {
    id: 1,
    title: 'Example number 1',
    amount: {
      type: 'positive',
      amount: '450,56',
    },
    datetime: '12-10-1994',
  },
  {
    id: 2,
    title: 'Example number 2',
    amount: {
      type: 'negative',
      amount: '420,56',
    },
    datetime: '13-10-1994',
  },
];

const ThirdStep = (props: any) => {
  const handleChangeChk = () => {
    console.log('ciao');
  };
  return (
    <div className="StepWizardStep">
      <h1>Select transactions related to savings for -bank-</h1>
      <p>
        Selecting transactions related to your saving acount is needed to show
        you correct insights
      </p>

      {dummydata.map(element => (
        <div className="inputWrapper checkboxWrapper">
          <div>
            <input
              type="checkbox"
              id={'chekbox_' + element.id}
              defaultChecked={false}
              onChange={handleChangeChk}
            />
            <label htmlFor={'chekbox_' + element.id}>{element.title}</label>
          </div>
          <span>
            {element.amount.type === 'positive' ? '+' : '-'}
            {element.amount.amount}
          </span>
          <span>
            {element.datetime}
          </span>
        </div>
      ))}

      <div className="flex flex-centered inputWrapper" />
      <StepsHandler amount={3} currentStep={1} goToStep={props.goToStep} />
      <div className="flex flex-centered">
        <button
          className="button button-primary"
          onClick={() => props.goToStep(+props.step - 1)}
        >
          Previous
        </button>
        <button
          className="button button-primary"
          onClick={() => props.goToStep(+props.step + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ThirdStep;
