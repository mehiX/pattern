import { useLink } from '../../../services';
import { useCurrentUser } from '../../../services';
import Button from 'plaid-threads/Button';

const FirstStep = (props: any) => {
  const { userState } = useCurrentUser();
  // Get users
  const rawUser = localStorage.getItem('jubleeUser');
  console.log('rawUser', rawUser);
  const jubleeUser = rawUser ? JSON.parse(rawUser) : null;
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
      <h1>Connect</h1>
      <h2>Hi, {userState.currentUser.username}</h2>
      <p>Tap the button to connect with your bank </p>
      <button className="button button-primary" onClick={initiateLink}>
        Start
      </button>
      {/* <button
        className="button button-primary"
        onClick={() => props.goToStep(+props.step + 1)}
      >
        Next
      </button> */}
    </div>
  );
};

export default FirstStep;
