import { useLink } from '../../../services';
import Input from '../../Elements/Input';

const SecondStep = (props: any) => {
  // Get users
  const rawUser = localStorage.getItem('jubleeUser');
  const jubleeUser = rawUser ? JSON.parse(rawUser).jubleeUser : null;
  // TODO TO FETCH
  const userId = 4;
  const { generateLinkToken, linkTokens } = useLink();
  const initiateLink = async () => {
    // only generate a link token upon a click from enduser to add a bank;
    // if done earlier, it may expire before enduser actually activates Link to add a bank.
    await generateLinkToken(userId, null);
  };
  return (
    <div className="StepWizardStep">
      <h1>Add the savings account balance for -Bank-</h1>
      <p>
        Adding your saving account balance is needed to show you correct
        insights
      </p>
      <Input value="0" />
      <button
        className="button button-primary"
        onClick={() => props.goToStep(+props.step + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default SecondStep;
