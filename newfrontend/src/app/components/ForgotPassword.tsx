interface ForgotPasswordProps {
    onSubmit: (email: string) => void;
    onBack: () => void;
  }
  
  export const ForgotPassword = ({ onSubmit, onBack }: ForgotPasswordProps) => {
    const [email, setEmail] = useState("");
  
    return (
      <div>
        <h2>Forgot Password</h2>
  
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
  
        <button onClick={() => onSubmit(email)}>
          Send Reset OTP
        </button>
  
        <button onClick={onBack}>Back</button>
      </div>
    );
  };
  