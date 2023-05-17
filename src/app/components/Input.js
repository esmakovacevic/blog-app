export default function Input({children,...props}) {
    return (
     <div>
      <input {...props}>{children}</input>
     </div>
    );
  }