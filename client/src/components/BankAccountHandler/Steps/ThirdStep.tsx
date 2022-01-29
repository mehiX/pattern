import { useLink } from '../../../services';
import Input from '../../Elements/Input';
import StepsHandler from './StepsHandler';

const ThirdStep = (props: any) => {
  return (
    <div className="StepWizardStep">
      <h1>Add the savings account balance for -Bank-</h1>
      <p>
        Adding your saving account balance is needed to show you correct
        insights
      </p>
      <div className="flex flex-centered inputWrapper">
        <span className="currency">€</span>
        <Input
          id="savings"
          labelName="Add your savings"
          inputType="number"
          step="0.01"
        />
      </div>
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
