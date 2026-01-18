interface ResetPasswordProps {
    email: string;
    onReset: (otp: string, password: string) => void;
  }
  
  export const ResetPassword = ({ email, onReset }: ResetPasswordProps) => {
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
  
    return (
      <div>
        <h2>Reset Password</h2>
        <p>{email}</p>
  
        <input
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
  
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
  
        <button onClick={() => onReset(otp, password)}>
          Reset Password
        </button>
      </div>
    );
  };
  