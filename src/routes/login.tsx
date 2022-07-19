import { useNavigate, Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../contexts/auth_context";
import { getErrorMessages } from "../lib/errors";

import "./form.css";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must have minimum of 8 characters" }),
});

type FormData = z.infer<typeof formSchema>;

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState, setError } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Adding server error to errors type
  type ErrorsType = typeof formState.errors & { server?: { message: string } };

  // eslint-disable-next-line prefer-destructuring
  const errors: ErrorsType = formState.errors;

  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
      navigate("/", { replace: true });
    } catch (e) {
      const serverErrors = await getErrorMessages(e as Error);
      serverErrors.forEach((error) => setError(error.name, error));
    }
  };

  return (
    <main className="bg-neutral-100 min-h-screen">
      <header className="p-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">BetterNotes</h1>
        <Link
          to="/sign_up"
          className="border rounded-md border-black px-3 py-2"
        >
          Sign up
        </Link>
      </header>

      <section className="max-w-md w-11/12 p-6 mt-4 mx-auto bg-white rounded-xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-field">
            <label htmlFor="email" className="mb-2">
              Email address
            </label>
            <input
              id="email"
              className="form-input"
              type="email"
              {...register("email")}
            />
            {errors.email && <small role="alert">{errors.email.message}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="password" className="mb-2">
              Password
            </label>
            <input
              id="password"
              className="form-input"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <small role="alert">{errors.password.message}</small>
            )}
          </div>
          {errors.server && <small role="alert">{errors.server.message}</small>}

          <button type="submit" className="submit-btn">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
